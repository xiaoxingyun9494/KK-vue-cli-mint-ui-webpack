export default {
    title: '',
    appType: '',
    baseURL: 'http://192.168.2.105/',
    pageURL: 'http://hsj.nos-eastchina1.126.net/appv1/views/',
    imageURL: 'http://hsj.nos-eastchina1.126.net/appv1/images/',
    injectURL: 'http://hsj.nos-eastchina1.126.net/appv1/js/',
    serverURL: 'http://app.haoshijie.info/bch/hsj/views/',
    ucBaseURL: 'https://open.uczzd.cn',
    mainColor: '#ff5b06',
    plusWebvURL(path) {
        let i = path.indexOf('.html');
        let params = path.slice(i+5) ? path.slice(i+5) + '&' : '?';
        return '_www/views/page.html' + params +'module=' + encodeURIComponent(this.pageURL + path.slice(0, i+5));
    }
}
