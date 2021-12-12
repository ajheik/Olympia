class Maa:
    def __init__(self, nimi, mitalit):
        self.nimi = nimi
        self.mitalit = mitalit

    def tulosta(self):
        print("Nimi : ",self.nimi,"\nMitalit : ",self.mitalit[0],"K ",self.mitalit[1],"S ", self.mitalit[2], "P")