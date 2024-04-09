const http=require('http'); //http module (create server)
const url=require('url'); //url module (parse url)
const fs=require('fs'); //file system module (read file)

// read data when server starts only once
const data =fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const tempProduct =fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const card =fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const overview =fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');

const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%ProductName%}/g,product.productName);
    output=output.replace(/{%Image%}/g,product.image);
    output=output.replace(/{%From%}/g,product.from);
    output=output.replace(/{%Nutrients%}/g,product.nutrients);
    output=output.replace(/{%Quantity%}/g,product.quantity);
    output=output.replace(/{%Price%}/g,product.price);
    output=output.replace(/{%disc%}/g,product.description);
    output=output.replace(/{%Id%}/g,product.id);
    if(!product.organic) output=output.replace(/{%NotOrganic%}/g,'not-organic');
    return output;
}

const server=http.createServer((req,res)=>{
    const {query,pathname}=url.parse(req.url,true);

    // overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const cards=dataObj.map(el => {
            return replaceTemplate(card, el);
        }).join('');
        const output=overview.replace('{%ProductCard%}',cards);
        res.end(output);
    } 
    // product page
    else if (pathname === '/product') {
        const product=dataObj[query.id];
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        output=replaceTemplate(tempProduct,product);
        res.end(output);
    }
    // api page
    else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    }
    // not found page
    else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8000,'127.0.0.1',()=>{
    console.log("Server is listening to requests on port 8000");
});


