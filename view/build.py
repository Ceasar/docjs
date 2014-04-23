from pprint import pprint
import json
from staticjinja import make_renderer


def prune(d):
    if type(d) == list:
        rv = []
        for x in d:
            y = prune(x)
            if y:
                rv.append(y)
        return rv
    elif type(d) == dict:
        rv = {}
        for k, v in d.iteritems():
            y = prune(v)
            if y:
                rv[k] = y
        if len(rv) == 1 and "name" in rv:
            return {}
        else:
            return rv
    else:
        return d


def get_catalogs():
    with open('patterns.json') as f:
        x = prune(json.loads(f.read()))
        for k, v in x.iteritems():
            pprint(v)
        return {'filenames': x}

renderer = make_renderer(contexts=[
    ("index.html", get_catalogs),
])
renderer.run()
