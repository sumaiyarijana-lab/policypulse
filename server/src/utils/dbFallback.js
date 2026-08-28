const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../../db_mock.json');

// Initialize mock DB file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], complaints: [] }, null, 2));
}

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    return { users: [], complaints: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ [MockDB] Failed to write to mock database file:', err.message);
  }
}

function makeQueryChain(promiseOrValue) {
  const chain = {
    then: function(resolve, reject) {
      return Promise.resolve(promiseOrValue).then(resolve, reject);
    },
    select: function() { return this; },
    sort: function(sortOpts) {
      if (sortOpts) {
        const promise = Promise.resolve(promiseOrValue).then(arr => {
          if (Array.isArray(arr)) {
            const sorted = [...arr];
            if (sortOpts.createdAt) {
              sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            return sorted;
          }
          return arr;
        });
        return makeQueryChain(promise);
      }
      return this;
    },
    populate: function() { return this; },
    exec: function() {
      return Promise.resolve(promiseOrValue);
    }
  };
  return chain;
}

function wrapDocument(data, Model, collectionName) {
  const doc = new Model(data);
  doc._id = data._id; // Retain ID from JSON file
  
  // Custom save for this instance
  doc.save = async function() {
    console.log(`💾 [MockDB] Saving document instance to ${Model.modelName}...`);
    
    // Hash password if modified
    if (Model.modelName === 'User' && doc.password && (!doc.password.startsWith('$2a$') && !doc.password.startsWith('$2b$'))) {
      doc.password = await bcrypt.hash(doc.password, 12);
    }
    
    const db = readDb();
    if (!db[collectionName]) db[collectionName] = [];
    
    const plainObject = doc.toObject();
    
    const index = db[collectionName].findIndex(item => String(item._id) === String(doc._id));
    if (index !== -1) {
      db[collectionName][index] = { ...db[collectionName][index], ...plainObject, updatedAt: new Date() };
    } else {
      db[collectionName].push({ ...plainObject, updatedAt: new Date() });
    }
    
    writeDb(db);
    return doc;
  };

  return doc;
}

function enableMockDb() {
  console.log('⚠️ [MockDB] Initializing In-Memory/JSON File Database Fallback...');
  
  const modelNames = mongoose.modelNames();
  
  modelNames.forEach(name => {
    const Model = mongoose.model(name);
    const collectionName = name.toLowerCase() + 's'; // 'users' or 'complaints'
    
    // Override findOne
    Model.findOne = function(query) {
      console.log(`🔍 [MockDB] ${name}.findOne called with`, query);
      const db = readDb();
      const items = db[collectionName] || [];
      
      const found = items.find(item => {
        return Object.keys(query).every(key => {
          if (query[key] && typeof query[key] === 'object') {
            if (query[key].$gt !== undefined) {
              return new Date(item[key]) > new Date(query[key].$gt);
            }
          }
          return String(item[key]) === String(query[key]);
        });
      });
      
      const doc = found ? wrapDocument(found, Model, collectionName) : null;
      return makeQueryChain(doc);
    };
    
    // Override find
    Model.find = function(query) {
      console.log(`🔍 [MockDB] ${name}.find called`);
      const db = readDb();
      const items = db[collectionName] || [];
      
      const docs = items.map(item => wrapDocument(item, Model, collectionName));
      return makeQueryChain(docs);
    };
    
    // Override findById
    Model.findById = function(id) {
      console.log(`🔍 [MockDB] ${name}.findById called with`, id);
      const db = readDb();
      const items = db[collectionName] || [];
      
      const found = items.find(item => String(item._id) === String(id));
      const doc = found ? wrapDocument(found, Model, collectionName) : null;
      return makeQueryChain(doc);
    };
  });
  
  // Override mongoose Model prototype save
  mongoose.Model.prototype.save = async function() {
    const ModelName = this.constructor.modelName;
    const collectionName = ModelName.toLowerCase() + 's';
    console.log(`💾 [MockDB] Saving new document instance to ${ModelName}...`);
    
    if (!this._id) {
      this._id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    
    // Hash password if User
    if (ModelName === 'User' && this.password && (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$'))) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    
    // Generate complaintId if Complaint
    if (ModelName === 'Complaint' && !this.complaintId) {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      this.complaintId = `CMP-${Date.now().toString().slice(-4)}${randomNum}`;
    }
    
    const db = readDb();
    if (!db[collectionName]) db[collectionName] = [];
    
    const plainObject = this.toObject ? this.toObject() : JSON.parse(JSON.stringify(this));
    
    const index = db[collectionName].findIndex(item => String(item._id) === String(this._id));
    if (index !== -1) {
      db[collectionName][index] = { ...db[collectionName][index], ...plainObject, updatedAt: new Date() };
    } else {
      db[collectionName].push({ ...plainObject, createdAt: this.createdAt, updatedAt: new Date() });
    }
    
    writeDb(db);
    return this;
  };
}

module.exports = { enableMockDb };
