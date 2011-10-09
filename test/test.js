var testData = {
    sources: [
        {
            id: 1,
            title: 'Прямые заходы',
            type: 'direct'
        },
        {
            id: 2,
            title: 'Поиск Google',
            type: 'se'
        },
        {
            id: 3,
            title: 'Поиск Yandex',
            type: 'se'
        },
        {
            id: 4,
            title: 'Группа Facebook',
            type: 'normal'
        }
    ],
    nodes: [
        {
            id: 5,
            url: 'http://example.com/'
        },
        {
            id: 6,
            url: 'http://example.com/abc/'
        },
        {
            id: 7,
            url: 'http://example.com/qwerty/'
        },
        {
            id: 8,
            url: 'http://example.com/news/'
        },
        {
            id: 9,
            url: 'http://example.com/news/tech/'
        },
        {
            id: 10,
            url: 'http://example.com/news/social/'
        }
    ],
    edges: [
        // direct -> http://example.com/
        {
            from: 1,
            to: 5,
            count: 180
        },
        // direct -> http://example.com/news/
        {
            from: 1,
            to: 8,
            count: 80
        },
        // direct -> http://example.com/qwerty/
        {
            from: 1,
            to: 7,
            count: 30
        },
        // google -> http://example.com/news/
        {
            from: 2,
            to: 8,
            count: 280
        },
        // google -> http://example.com/news/tech/
        {
            from: 2,
            to: 9,
            count: 340
        },
        // google -> http://example.com/abc/
        {
            from: 2,
            to: 6,
            count: 50
        },
        // yandex -> http://example.com/news/
        {
            from: 3,
            to: 8,
            count: 400
        },
        // yandex -> http://example.com/news/tech/
        {
            from: 3,
            to: 9,
            count: 450
        },
        // yandex -> http://example.com/abc/
        {
            from: 3,
            to: 6,
            count: 75
        },
        // facebook -> http://example.com/qwerty/
        {
            from: 4,
            to: 7,
            count: 250
        },
        // facebook -> http://example.com/news/tech/
        {
            from: 4,
            to: 9,
            count: 120
        },
        // facebook -> http://example.com/
        {
            from: 4,
            to: 5,
            count: 300
        },
        // http://example.com/ -> http://example.com/news/
        {
            from: 5,
            to: 8,
            count: 600
        },
        // http://example.com/ -> http://example.com/abc/
        {
            from: 5,
            to: 6,
            count: 470
        },
        // http://example.com/ -> http://example.com/qwerty/
        {
            from: 5,
            to: 7,
            count: 380
        },
        // http://example.com/news/ -> http://example.com/news/tech/
        {
            from: 8,
            to: 9,
            count: 500
        },
        // http://example.com/news/ -> http://example.com/news/social/
        {
            from: 8,
            to: 10,
            count: 450
        },
        // http://example.com/news/tech/ -> http://example.com/news/social/
        {
            from: 9,
            to: 10,
            count: 120
        },
        // http://example.com/news/social/ -> http://example.com/news/tech/
        {
            from: 10,
            to: 9,
            count: 140
        },
        // http://example.com/news/socials -> http://example.com/
        {
            from: 10,
            to: 5,
            count: 230
        },
        // http://example.com/news/ -> http://example.com/
        {
            from: 8,
            to: 5,
            count: 230
        }
    ]
}