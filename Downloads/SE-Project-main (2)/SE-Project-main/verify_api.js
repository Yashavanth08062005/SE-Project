const http = require('http');

[1, 2, 3, 4].forEach(id => {
    http.get(`http://localhost:3001/api/state/${id}`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log(`ID ${id} Peers:`, JSON.stringify(json.peers));
            } catch (e) {
                console.log(`ID ${id} Error:`, data);
            }
        });
    }).on('error', e => console.error(e));
});
