const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../assets/counter.json');

function getCounters() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function updateCounter(userId) {
    const counters = getCounters();

    // Increment or start at 1
    counters[userId] = (counters[userId] || 0) + 1;

    // Save back to the file
    fs.writeFileSync(filePath, JSON.stringify(counters, null, 2));

    return counters[userId];
}

module.exports = { updateCounter };