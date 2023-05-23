const express = require('express');
const router = express.Router();

// 引入路由文件
const siteRoutes = require('./siteRoutes');

const odfRoutes = require('./odfRoutes');

const fiberPanelRoutes = require('./fiberPanelRoutes');

const fiberCoreRoutes = require('./fiberCoreRoutes');

const connectionRoutes = require('./connectionRoutes');

const userRoutes = require('./userRoutes');

// 将站点与路径关联
router.use('/sites', siteRoutes);

router.use('/odfs', odfRoutes);

router.use('/panels', fiberPanelRoutes);

router.use('/cores', fiberCoreRoutes);

router.use('/connections', connectionRoutes);

router.use('/users', userRoutes);

module.exports = router;
