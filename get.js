function get(url,onLoad){
    if(!url){return}
    if(!onLoad){return}
    if(typeof(url)!=="string"){return}
    if(typeof(onLoad)!=="function"){return}
    function convertStandardUrl(url,hostnames){
        function isUrlExist(url,urls){
            return (urls["indexOf"](new URL(url)["hostname"])!==-1)
        }
        function random(array){
            return array[Math["floor"](array["length"]*Math["random"]())]
        }
        hostnames=hostnames||[]
        var output=url
        if(isUrlExist(url,hostnames["concat"]([
            // 必须使用代理
            "www.google.com"
        ]))){
            output=random([
                "https://jsonp.afeld.me/?url=",
                "https://api.allorigins.win/raw?url=",
                "https://salty-earth-46109.herokuapp.com/",
                "https://eerovil-cors-proxy.herokuapp.com/",
                "https://lazyguy-nhl-proxy.herokuapp.com/",
                "https://cors-anywhere.herokuapp.com/"
            ])+url
            console["log"](output)
        }
        return output
    }
    function getByStandardUrl(method,url,onLoad){
        method(convertStandardUrl(url,[
            new URL(url)["hostname"]
        ]),onLoad,true)
    }
    if(typeof(XMLHttpRequest)==="function"){
        function xmlGet(url,onLoad,fromRetry){
            var request=new XMLHttpRequest()
            if(!fromRetry){
                request["addEventListener"]("error",function(event){
                    getByStandardUrl(xmlGet,url,onLoad)
                })
                url=convertStandardUrl(url,[
                    // 仅浏览器里需要使用代理
                    "www.baidu.com",
                    "fund.eastmoney.com"
                ])
            }
            request["onreadystatechange"]=function(event){
                if(request["readyState"]===4&&request["status"]===200){
                    onLoad(request["responseText"])}}
            request["open"]("GET",url,true)
            request["send"](null)
        }
        return xmlGet(url,onLoad)
    }
    if(typeof(Deno)==="object"){
        function denoGet(url,onLoad,fromRetry){
            let originUrl=url
            if(!fromRetry){
                url=convertStandardUrl(url)
            }
            fetch(url,{
                headers:{"Origin":"origin"}
            })["then"](function(response){
                return response["text"]()})["catch"](function(error){
                    if(!fromRetry){
                        getByStandardUrl(denoGet,originUrl,onLoad)
                    }else{
                        console["log"](error)
                    }
                })["then"](function(text){
                    onLoad(text)})
        }
        return denoGet(url,onLoad)
    }
    if(true){
        function nodeGet(url,onLoad,fromRetry){
            function protocol(url){
                return new URL(url)["protocol"]["replace"](":","")
            }
            let originUrl=url
            if(!fromRetry){
                url=convertStandardUrl(url)
            }
            require(protocol(url))["get"](url,{
                headers:{"Origin":"origin"}
            },function(response){
                response["on"]("data",function(data){
                    onLoad(data["toString"]())
                })
            })["on"]("error",function(error){
                if(!fromRetry){
                    getByStandardUrl(nodeGet,originUrl,onLoad)
                }else{
                    console["log"](error)
                }
            })
        }
        return nodeGet(url,onLoad)
    }
}
