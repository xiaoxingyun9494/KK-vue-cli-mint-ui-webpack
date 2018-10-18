export default function (size) {
    var tid = null, doc = document;
    function refreshRem() {
        var iScreen = doc.documentElement.clientWidth;
        if (iScreen > size) iScreen = size;

        doc.documentElement.style.fontSize = iScreen / size * 100 + 'px';
    };

    window.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);

    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    refreshRem();
};
