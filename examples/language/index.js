/**
 * An example that annotates the sentences of each item with their language.
 */

 const { Downstream } = require('downstream');
 const LanguageChannel = require('./channel');
 const { languageHook, logHook } = require('./hooks');
 
 const langChannel = new LanguageChannel({ interval: 2000 });
 
 const downstream = new Downstream();
 
 // register channels
 downstream.register(langChannel);
 
 // use hooks
 downstream.use(languageHook);
 downstream.use(logHook);
 
 // log any errors
 downstream.on('error', console.log);
 
 // start Downstream
 downstream.start();