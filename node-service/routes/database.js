const request = require('../utils/request.define')
var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();
const multiparty = require("multiparty")

// 上传图片
router.post('/upload/image', (req, res) => {
  let form = new multiparty.Form()
  form.parse(req, (err, formData, imgData) => {
    console.log('imgData', imgData)
  })
  // const file = req.file;
  // console.log('file', req)
  // const formData = new FormData()
  // formData.set('fil')
  // request.post('/upload/image',)
})

module.exports = router
