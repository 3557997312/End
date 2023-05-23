/* 配线单元盒 */

const express = require('express');
const router = express.Router();

// 导入站点控制器
const odfController = require('../controllers/odfController');

// 获取所有配线单元盒信息
router.get('/', odfController.getAllOdfs);

// 根据参数获取满足条件的所有配线单元盒信息
router.get('/name/:BoxName', odfController.getOdf);
router.get('/SiteID/:SiteID', odfController.getOdf);

// router.get('/:parameter/:value', odfController.getOdf);

// 创建新配线单元盒
router.post('/', odfController.createBox);

// 根据参数更新对应的配线单元盒信息
router.put('/', odfController.updateOdf);

// 根据参数删除对应的配线单元盒信息
router.delete('/name/:BoxName', odfController.deleteOdf);
router.delete('/SiteID/:SiteID', odfController.deleteOdf);

// router.delete('/:parameter/:value', odfController.deleteOdf);

module.exports = router;