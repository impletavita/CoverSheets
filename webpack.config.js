const path = require('path');

module.exports = {
  
  mode: 'production',
  entry: {
    main: path.resolve('./src', 'CoverSheets.js')
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'CoverSheets.js',
    library: {
      name: 'CoverSheets',
      type: 'var'
    }
  }
}