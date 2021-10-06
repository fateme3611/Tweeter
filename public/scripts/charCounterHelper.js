function updateCharecterCounter(e) {
    const len = MAX_TWEET_LENGTH - e.target.value.length;
    setCounterValue(len);
}

function setCounterValue(val) {
    const $counter = $('.new-tweet .counter');
    let color = '';
    if (val < 0) {
        color = 'red';
    }
    $counter.text(val).css({ color: color });
}