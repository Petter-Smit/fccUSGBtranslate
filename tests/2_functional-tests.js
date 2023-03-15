const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Translation with text and locale fields: POST request to /api/translate', () => {
        chai.request(server).post('/api/translate').send({text: 'I ate yogurt for breakfast.', locale: 'american-to-british'}).end((err, res) =>{
            assert.equal(res.status, 200);
            assert.property(res.body, 'text');
            assert.equal(res.body.text, 'I ate yogurt for breakfast.');
            assert.property(res.body, 'translation');
            assert.equal(res.body.translation, 'I ate <span class="highlight">yoghurt</span> for breakfast.');
        });
    });
    test('Translation with text and invalid locale field: POST request to /api/translate', () => {
        chai.request(server).post('/api/translate').send({text: 'I ate yogurt for breakfast.', locale: 'trushamanapression'}).end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Invalid value for locale field');
        });
    });
    test('Translation with missing text field: POST request to /api/translate', () => {
        chai.request(server).post('/api/translate').send({locale: 'american-to-british'}).end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Required field(s) missing');
        });
    });
    test('Translation with missing locale field: POST request to /api/translate', () => {
        chai.request(server).post('/api/translate').send({text: 'american-to-british'}).end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Required field(s) missing');
        });
    });
    test('Translation with missing locale field: POST request to /api/translate', () => {
        chai.request(server).post('/api/translate').send({text: '', locale: 'american-to-british'}).end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'No text to translate');
        });
    });
    test('Translation with text that needs no translation: POST request to /api/translate', () => {
        chai.request(server).post('/api/translate').send({text: 'Good morning! Great day for fishing!', locale: 'american-to-british'}).end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'text');
            assert.equal(res.body.text, 'Good morning! Great day for fishing!');
            assert.property(res.body, 'translation');
            assert.equal(res.body.translation, 'Everything looks good to me!');
        });
    });
});
