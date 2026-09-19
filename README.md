# ParoVarya

file:///C:/Users/Manoswini/Documents/Codex/2026-09-12/build-x20/frontend/index.html

/* Paro Varya REST API starter. Replace demoStore with mysql2/promise queries after configuring .env. */
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','frontend');
let projects=[
{id:1,title:'Kumartuli: Living Clay Art',category:'Crafts',city:'Kolkata',state:'West Bengal',community:'Clay artisans',description:'A living neighbourhood of clay artisans.'},
{id:2,title:'North Kolkata Courtyard Houses',category:'Architecture',city:'Kolkata',state:'West Bengal',community:'Local residents',description:'A community record of domestic architecture.'},
{id:3,title:'Pithe Traditions of Bengal',category:'Food & Culinary Traditions',city:'Kolkata',state:'West Bengal',community:'Bengali home cooks',description:'Stories and seasonal memories around festive foods.'}
];let contributions=[];
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))};
function body(req){return new Promise((ok,bad)=>{let d='';req.on('data',x=>{d+=x;if(d.length>100000)bad(Error('Payload too large'))});req.on('end',()=>{try{ok(d?JSON.parse(d):{})}catch{bad(Error('Invalid JSON'))}})})}
const clean=s=>typeof s==='string'?s.trim().replace(/[<>]/g,''):'';
http.createServer(async(req,res)=>{let u=new URL(req.url,'http://localhost');try{
if(req.method==='GET'&&u.pathname==='/api/projects')return send(res,200,projects);
if(req.method==='GET'&&u.pathname==='/api/categories')return send(res,200,[...new Set(projects.map(p=>p.category))]);
if(req.method==='GET'&&u.pathname==='/api/search'){let q=clean(u.searchParams.get('q')||'').toLowerCase();return send(res,200,projects.filter(p=>Object.values(p).join(' ').toLowerCase().includes(q)))}
let match=u.pathname.match(/^/api/projects/(\d+)(/contributions)?$/);if(req.method==='GET'&&match){let p=projects.find(x=>x.id===+match[1]);if(!p)return send(res,404,{error:'Project not found'});return send(res,200,match[2]?contributions.filter(c=>c.heritage_project_id===p.id):p)}
if(req.method==='POST'&&u.pathname==='/api/projects'){let d=await body(req),title=clean(d.title),city=clean(d.city),category=clean(d.category),description=clean(d.description);if(!title||!city||!category||!description)return send(res,400,{error:'title, city, category and description are required'});let p={id:projects.length+1,title,city,category,description,state:clean(d.state),community:clean(d.community)};projects.push(p);return send(res,201,p)}
if(req.method==='POST'&&match&&match[2]){let p=projects.find(x=>x.id===+match[1]);if(!p)return send(res,404,{error:'Project not found'});let d=await body(req),title=clean(d.title),contributor_name=clean(d.contributor_name),type=clean(d.contribution_type);if(!title||!contributor_name||!type)return send(res,400,{error:'title, contributor_name and contribution_type are required'});let c={id:contributions.length+1,heritage_project_id:p.id,title,contributor_name,contribution_type:type,description:clean(d.description),created_at:new Date().toISOString()};contributions.push(c);return send(res,201,c)}
let file=path.normalize(path.join(root,u.pathname==='/'?'index.html':u.pathname));if(!file.startsWith(root))return send(res,403,{error:'Forbidden'});fs.readFile(file,(e,data)=>{if(e)return send(res,404,{error:'Not found'});let ext=path.extname(file);res.writeHead(200,{'Content-Type':ext==='.css'?'text/css':ext==='.js'?'application/javascript':'text/html'});res.end(data)})
}catch(e){send(res,e.message==='Payload too large'?413:400,{error:e.message})}}).listen(process.env.PORT||3000,()=>console.log('Paro Varya running at http://localhost:3000'));

/* SQL SCHEMA */
CREATE DATABASE IF NOT EXISTS paro_varya CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE paro_varya;
CREATE TABLE heritage_projects (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(180) NOT NULL, local_name VARCHAR(180), slug VARCHAR(200) NOT NULL UNIQUE,
description TEXT NOT NULL, category VARCHAR(80) NOT NULL, cultural_significance TEXT, historical_context TEXT, community VARCHAR(180),
state VARCHAR(80) NOT NULL, district VARCHAR(100), city VARCHAR(100) NOT NULL, latitude DECIMAL(10,7), longitude DECIMAL(10,7),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
INDEX idx_project_discovery (category, state, city), INDEX idx_project_title (title)
);
CREATE TABLE contributions (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, heritage_project_id INT UNSIGNED NOT NULL,
contribution_type ENUM('photograph','video','audio','document','story','research','external_link') NOT NULL, title VARCHAR(180) NOT NULL,
description TEXT, contributor_name VARCHAR(100) NOT NULL, source VARCHAR(255), file_path VARCHAR(500), external_url VARCHAR(500), consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_contribution_project FOREIGN KEY (heritage_project_id) REFERENCES heritage_projects(id) ON DELETE CASCADE, INDEX idx_contribution_project (heritage_project_id)
);
CREATE TABLE media (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, contribution_id INT UNSIGNED NOT NULL, file_name VARCHAR(255) NOT NULL, file_path VARCHAR(500) NOT NULL, media_type VARCHAR(80) NOT NULL, file_size INT UNSIGNED, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_media_contribution FOREIGN KEY (contribution_id) REFERENCES contributions(id) ON DELETE CASCADE);
CREATE TABLE project_sources (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, heritage_project_id INT UNSIGNED NOT NULL, title VARCHAR(255) NOT NULL, source_type VARCHAR(80), url VARCHAR(500), description TEXT, CONSTRAINT fk_source_project FOREIGN KEY (heritage_project_id) REFERENCES heritage_projects(id) ON DELETE CASCADE);
CREATE TABLE project_timeline (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, heritage_project_id INT UNSIGNED NOT NULL, event_title VARCHAR(180) NOT NULL, event_description TEXT, event_date VARCHAR(50), CONSTRAINT fk_timeline_project FOREIGN KEY (heritage_project_id) REFERENCES heritage_projects(id) ON DELETE CASCADE);
CREATE TABLE future_users (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, display_name VARCHAR(100), email VARCHAR(255) UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CAN YOU PLEASE BUILD THE PLATFORM USING THESE DATA???

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b2333cac-fe06-498b-bb32-3585768383d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
