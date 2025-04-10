const express = require('express')
const router = express.Router()
const groups = require('../controllers/groups.js')

router.get('/api/mygroups', groups.getGroups)
router.post('/api/mygroups', groups.newGroups)
router.get('/api/mygroups/:gid', groups.listGroupMembers)
router.put('/api/mygroups/:gid/:uid', groups.addGroupMember)
router.delete('/api/mygroups/:gid/:uid', groups.deleteGroupMember)
router.get('/api/groupsmember', groups.getMemberGroups)

module.exports = router
