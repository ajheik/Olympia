from tinydb import TinyDB, Query
db = TinyDB('db.json')

User = Query()

def insert():
    db.insert({'maa': 'Suomi', 'kulta': 144, 'hopea': 148, 'pronssi': 178})
    db.insert({'maa': 'Ruotsi', 'kulta': 202, 'hopea': 216, 'pronssi': 234})
    db.insert({'maa': 'Norja', 'kulta': 188, 'hopea': 174, 'pronssi': 158})

def update():
    db.update({'kulta': 146, 'hopea': 154, 'pronssi': 186}, User.maa == 'Suomi')
    db.update({'kulta': 203, 'hopea': 220, 'pronssi': 250}, User.maa == 'Ruotsi')
    db.update({'kulta': 190, 'hopea': 200, 'pronssi': 172}, User.maa == 'Norja')

def search(maa):
    result = db.search(User.maa == maa)
    print(result)

def printDB():
    for item in db:
        print(item)

db.truncate()
insert()
printDB()
print('Päivitetty tietokanta:')
update()
printDB()
print('Etsitty maa:')
search('Norja')