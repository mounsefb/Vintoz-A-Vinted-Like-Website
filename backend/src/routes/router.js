const router = require('express').Router()
router.use(require('./user'))
router.use(require('./post'))
router.use(require('./favorite'))
router.use(require('./category'))
router.use(require('./groups'))
router.use(require('./messages'))
router.use(require('./offer'))


module.exports = router
