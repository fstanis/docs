/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {htmlContent} = require('@lib/common/cheerioUtil');
const cheerio = require('cheerio');
const transformers = require('./transformers');

class FormatTransform {
  constructor(target) {
    const transformer = transformers[target.toLowerCase()];
    if (!transformer) {
      transformer = null;
    }
    this.transformer_ = transformer;
  }

  transform(input) {
    if (!this.transformer_) {
      return input;
    }
    const $ = cheerio.load(input);
    for (const selector of Object.keys(this.transformer_)) {
      $(selector).forEach((el) => {
        this.transformElement_(el, this.transformer_[selector]);
      });
    }
    return htmlContent($);
  }

  transformElement_(el, transform) {
    if (transform === null) {
      transform = '';
    }
    let newNode = '';
    if (typeof transform === 'function') {
      newNode = transform(el);
    } else if (typeof transform === 'string') {
      newNode = transform;
    }
    el.replaceWith(newNode);
  }
}

module.exports = FormatTransform;
