module.exports = {
  'projectName': 'gateway-web',
  'privateKey': '',
  'passphrase': '',
  'modes': {
    'test': {
      'name': '测试环境',
      'script': 'npm run build',
      'host': '10.18.101.210',
      'port': 22,
      'username': 'root',
      'password': '',
      'distPath': 'dist',
      'webDir': '/usr/apps/gateway-web/gateway-web2',
      'backupDir': '/usr/apps/gateway-web/backup'
    }
  }
};