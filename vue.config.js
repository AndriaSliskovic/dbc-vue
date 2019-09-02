module.exports = {
  //outputDir: 'C:\development\source\Repos\deluxebrandcenter\Argosy.Web.Backend\Scripts\Vue',
  outputDir: 'dist',
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  },
  
  filenameHashing: false,
  pages: {
    main: {
      entry: 'src/main.js',
      filename: 'index.html'
    },
    featureManager: {
      entry: 'src/views/featureManager/bundle.js',
      filename: 'featureManager.html'
    }
  }
}

