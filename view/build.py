import json
from staticjinja import make_renderer


def get_catalogs():
    with open('patterns.json') as f:
        return {'catalogs': json.loads(f.read())}

renderer = make_renderer(contexts=[
    ("index.html", get_catalogs),
])
renderer.run(use_reloader=True)
