/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const MAX_TWEET_LENGTH = 140;

function tweetSubmitHandlet(e) {
  e.preventDefault();
  let errorMessage = '';
  const tweetLength = e.target['text'].value.length;

  if (tweetLength > 0 && tweetLength <= MAX_TWEET_LENGTH) {
    const data = $(e.target).serialize();
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: data,
      success: (successData) => {
        e.target.reset();
        setCounterValue(MAX_TWEET_LENGTH);
        addNewTweetToContainer(successData.tweet);
      }
    });
  } else if (tweetLength > MAX_TWEET_LENGTH) {
    errorMessage = 'Tweet content is too long';
  }
  else {
    errorMessage = 'Tweet is not present';
  }

  showNewTweetErrorMessage(errorMessage);
}

function showNewTweetErrorMessage(message) {
  if (message.length) {
    $('.new-tweet-error').text(message).slideDown();
  } else {
    $('.new-tweet-error').slideUp();
  }
}

function renderTweets(tweets) {
  const $container = $('#tweets-container');
  $container.empty();
  for (let tweet of tweets) {
    addNewTweetToContainer(tweet);
  }
}

function addNewTweetToContainer(tweetData) {
  const $container = $('#tweets-container');
  let $tweetElm = createTweetElement(tweetData);
  $container.prepend($tweetElm);
}

function createTweetElement(tweetData) {
  const $tweet = $('<article>', {
    class: "tweet-container"
  });

  const $tweetHeader = $(`<header class="tweet-header">
    <span class="tweet-user">
      <img class="tweet-user-image"></img>
      <span class="tweet-user-name"></span>
    </span>
    <span class="tweet-user-handle"></span>
    </header>`);

  $tweetHeader.find('.tweet-user-handle')
    .text(tweetData.user.handle);

  $tweetHeader.find('.tweet-user-name')
    .text(tweetData.user.name);

  $tweetHeader.find('img')
    .attr('src', tweetData.user.avatars);

  const $tweetBody = $('<div>', {
    class: "tweet-body",
  }).text(tweetData.content.text);

  const $tweetFooter = $(`<footer class="tweet-footer">
    <span class="tweet-creation-time"></span>
    <span class="tweet-icon-group">
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
    </span>
  </footer>`);

  $tweetFooter.find('.tweet-creation-time')
    .text(timeago.format(tweetData.created_at));

  $tweet.append($tweetHeader);
  $tweet.append($tweetBody);
  $tweet.append($tweetFooter);

  return $tweet;
}

function loadTweets() {
  $.ajax('http://localhost:8080/tweets', { method: 'GET' })
    .then((data) => {
      renderTweets(data);
    });
}


$(() => {
  loadTweets();
});

