// require the libraries for actions
import { getInput, warning, info } from '@actions/core';
import * as github from '@actions/github';

// use an async function for the main tasks
async function main() {
  // get inputs
  const GITHUB_TOKEN = getInput('GITHUB_TOKEN');

  const octokit = github.getOctokit(GITHUB_TOKEN);
  const context = github.context;
  // get the context from the github package
  // const { context } = require ('@actions/github');

  // log context
  // console.log( JSON.stringify(context.payload, null, "    ") );

  const action = github.context.payload.action
  if (!action) {
    warning('This action should only be used with pull requests.');
  }

  // if this pull request is being opened for the first time,
  // the payload action will be 'opened'. otherwise it will be some
  // other pull_request action. Take a look at the Webhook payload
  // object for a pull request event here:
  // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#pull_request
  if (action === 'opened') {
    // add a comment to the PR
    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: 'Thanks for opening this pull request! We will review it shortly.',
    })

    // add a label to the PR
    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      labels: ['acknowledged by bot'],
    })
  } else {
    info('This pull request was not opened for the first time. No action taken.');
    return;
  }
}

// call the function
main();
