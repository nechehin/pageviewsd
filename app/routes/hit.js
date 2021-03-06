const express = require('express');
const debug   = require('debug')('http');
const counter = require('./../counter');
const config  = require('./../config');
const _       = require('lodash');

const router = express.Router();
const zeroPixel = new Buffer('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
const skipUserAgentRegExp = new RegExp(config.useragent_skipwords.join('|'), 'i');


router.get('/:label/:id', function(req, res) {
    
    // Check if label is allowed in config
    if (!~config.labels.indexOf(req.params.label)) {
        res.status(403).end('Label not allowed');
        return;
    }
            
    // Check user-agent for skip words, if ok - increment counter        
    if (!req.headers['user-agent'].match(skipUserAgentRegExp)) {   
        // Increment counter
        counter.incrementLocal(req.params.label, req.params.id);
        debug('hit %s %d', req.params.label, req.params.id);
    } else {
        // Skip increment
        debug('hit %s %d skiped by useragent_skipwords', req.params.label, req.params.id);
    }

    // Return zero-pixel
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': zeroPixel.length
    });
    
    res.end(zeroPixel);
    
});

module.exports = router;