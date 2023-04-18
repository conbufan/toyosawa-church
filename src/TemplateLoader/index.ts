/*

Template Loader

*/

export const TemplateLoader = (url: string )=>{
    //console.log(`in TemplateLoader, try, ${url}`);
    return fetch(url)
            .then(response => {
                if ( !response.ok ){
                    throw new Error(`FETCHでエラーが発生 '${response.statusText}[${response.status}]' (${url})`)
                }
                //console.log(`in TemplateLoader, fetched, ${url}`);
                return response.text();
            })
            .then(data => {
                //const fragment = document.createDocumentFragment();
                const div = document.createElement("div");
                div.innerHTML = data;
                //console.log(`in TemplateLoader, done, ${url}`);
                //fragment.appendChild(div);
                return div.childNodes;
                //return data;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
};