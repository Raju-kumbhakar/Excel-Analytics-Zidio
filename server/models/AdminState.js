const mongoose = require('mongoose');

const adminStateSchema = new mongoose.Schema({
  // Admin approvals
  adminsActive: { type: [String], default: [] },
  adminsPending: { type: [String], default: [] },
  adminsRejected: { type: [String], default: [] },

  // Per-user flags { [email]: { active: bool, spam: bool } }
  userAdminFlags: { type: mongoose.Schema.Types.Mixed, default: {} },

  // System settings
  sysMaintenance: { type: Boolean, default: false },
  sysMaintenanceUntil: { type: Date, default: null },
  sysAlert: { type: String, default: '' },
  sysUploadLimit: { type: Number, default: 5 },

  // Audit
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'admin_state' });

adminStateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('AdminState', adminStateSchema);
