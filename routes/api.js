'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();
  
  app.route('/api/translate')
    .post((req, res) => {
      if (!req.body.hasOwnProperty('text') || !req.body.hasOwnProperty('locale')) {
        res.json({error: 'Required field(s) missing'});
        return;
      };
      if (req.body.text === ''){
        res.json({error: 'No text to translate'});
        return;
      }
      if (!(req.body.locale === 'american-to-british' || req.body.locale === 'british-to-american')){
        res.json({error: 'Invalid value for locale field'});
        return;
      }
      let translation = translator.hub(req.body.text, req.body.locale);
      res.json({text: req.body.text, translation: translation});
    });
};
