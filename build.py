import re

html = open("index.html").read()
css = open("style.css").read()
js = open("app.js").read()

html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '\n</style>')
html = html.replace('<script src="app.js"></script>', '<script>\n' + js + '\n</script>')

open("index_standalone.html", "w").write(html)
