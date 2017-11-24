const request = require('request');
const BaseParser = require('./base.parser');
const jsweeklyFeed = 'http://javascriptweekly.com/issues';
const absoluteLinkBody = 'http://javascriptweekly.com/';

class JsweeklyParser extends BaseParser {
	getAlias() {
		return 'jsweekly_parser';
	}

	parse() {
		request(jsweeklyFeed, (err, resp, body) => {
			this.document = this.getDOM(body);
			const issues = [].slice.call(this.document.querySelectorAll('.issue'));
			const issuesFiltered = issues.map((issue, index) => {
				if (index > 2) {
					return;
				}
				const descHtml = [].slice.call(issue.querySelectorAll('.desc li'));
				const desc = descHtml.map(el => el.innerHTML).join('\n');
				const linkHtml = issue.querySelector('a');
				const link = `${absoluteLinkBody}${linkHtml.getAttribute('href')}`;
				const title = `New issue is published: ${linkHtml.innerHTML}`;
				const message = [title, desc, link].join('\n\n');

				this.collection.find({uid: link}).toArray((err, res) => {
					if (res.length === 0) {
						this.handleRecord(message, link);
					}
				});
			});
		});
	}
}

module.exports = JsweeklyParser;