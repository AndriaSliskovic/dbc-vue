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
    // featureManager: {
    //   entry: 'src/views/featureManager/bundle.js',
    //   filename: 'featureManager.html'
    // },
    persona:{
      entry:'src/views/Persona/bundle.js',
      filename:'persona.html'
    },
    // customfields:{
    //   entry:'src/views/Persona/bundle1.js',
    //   filename:'customFields.html'
    // }
  },
  
}

