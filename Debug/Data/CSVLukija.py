from numpy import dtype, inf
import pandas as pd
import ssl
ssl._create_default_https_context = ssl._create_unverified_context  # Tää korjaa sen SSL: CERTIFICATE_VERIFY_FAILED jos yrittää lukea dataa URL:stä
pd.set_option("display.precision", 2)

df = pd.read_csv('https://query.data.world/s/cvvxnd5qafkvb64qq7jw44o6y2zcpr') # Data olympialaisista 1896-2018
Tokio2020Data = pd.read_csv('Tokio2020.csv', encoding='latin-1')              # Data vuoden 2020 olympialaisista (Lukee täl hetkel tuolta tiedostosta)
HostData = pd.read_csv('HostCities.csv', encoding='latin-1')                  # Data olympia isäntä valtioista
CodeData = pd.read_csv('https://raw.githubusercontent.com/datasets/country-codes/master/data/country-codes.csv')  # Täältä haetaan ne ISO3166-1 koodit kartaa varten
RecordsM  = pd.read_csv('RecordsMen.csv', encoding='latin-1')                 # Data nykyisistä miesten olympiaennätyksistä
RecordsW = pd.read_csv('RecordsWomen.csv', encoding='latin-1')                # Data nykyisistä naisten olympiaennätyksistä
Flags = pd.read_csv('Flags.csv', encoding='latin-1')
MedalsBySport = pd.read_csv('MedalsBySport.csv', encoding='latin-1')

# Annetaan jokaiselle valtiolle ISO3166-1 koodi d3-karttaa varten
df.set_index('Code', inplace = True)
HostData.set_index('Code', inplace = True)
CodeData.set_index('IOC', inplace = True)
RecordsM.set_index('NOC', inplace = True)
RecordsW.set_index('NOC', inplace = True)
MedalsBySport.set_index('NOC', inplace = True)
Flags.set_index('NOC', inplace = True)
Flags = Flags[~Flags.index.duplicated()]
CodeData = CodeData[~CodeData.index.duplicated()]
df['id'] = CodeData['ISO3166-1-Alpha-3']

# Koska Venäjä oli ROC eikä RUS vuonna 2020
Tokio2020Data.loc[Tokio2020Data['Team/NOC']=='ROC', 'NOCCode'] = 'RUS' 
Tokio2020Data.set_index('NOCCode', inplace = True)

# Vähän uudelleen nimetään asioita
df.rename(columns = {'Medal.1':'Medals (Total)', 'Apps':'Appearances (Total)', 
                     'SO_Apps':'Appearances (Summer)', 'WO_Apps':'Appearances (Winter)',
                     'SO_Medal':'Medals (Summer)', 'WO_Medal':'Medals (Winter)',
                     '':''}, inplace = True)

df.loc[df['Nation']=='Germany, East', 'Nation'] = 'East Germany'
df.loc[df['Nation']=='Germany, West', 'Nation'] = 'West Germany'
df.loc[df['Nation']=='Germany, United Team of', 'Nation'] = 'United Team of Germany'
df.loc[df['Nation']=='China, Republic of', 'Nation'] = 'Republic of China'
df.loc[df['Nation']=='Micronesia, Federated States of', 'Nation'] = 'Federated States of Micronesia'
df.loc[df['Nation']=='Yemen, North', 'Nation'] = 'North Yemen'
df.loc[df['Nation']=='Yemen, South', 'Nation'] = 'South Yemen'

# Lisätään 2020 vuoden mitalit muiden vuosien kokonaismitalimäärään
# Ne ketkä ei osallistunut 2020 olympialaisiin saa arvoksi NaN, tää vaihtaa ne nollaksi (0)
df['Tokio'] = Tokio2020Data['Total']
df['Tokio'] = df['Tokio'].fillna(0)
df['Medals (Total)'] += df['Tokio']
df['Medals (Summer)'] += df['Tokio']              

df['Tokio'] = Tokio2020Data['Gold']       
df['Tokio'] = df['Tokio'].fillna(0) 
df['Gold'] += df['Tokio']              
df['SO_Gold'] += df['Tokio']              

df['Tokio'] = Tokio2020Data['Silver']     
df['Tokio'] = df['Tokio'].fillna(0)  
df['Silver'] += df['Tokio']               
df['SO_Silver'] += df['Tokio']              

df['Tokio'] = Tokio2020Data['Bronze']       
df['Tokio'] = df['Tokio'].fillna(0)   
df['Bronze'] += df['Tokio']               
df['SO_Bronze'] += df['Tokio']      
     
# Lisätään isännöinti infot
df['Hosts (Total)'] = HostData['HostTotal']
df['Hosts (Total)'] = df['Hosts (Total)'].fillna(0)
df['Hosts (Summer)'] = HostData['HostSummer']
df['Hosts (Summer)'] = df['Hosts (Summer)'].fillna(0)
df['Hosts (Winter)'] = HostData['HostWinter']
df['Hosts (Winter)'] = df['Hosts (Winter)'].fillna(0)
df['HostInfo'] = HostData['Info']

# Ennätykset
df['RecordsM'] = RecordsM['Record']
df['RecordsW'] = RecordsW['Record']

# Liput
df['Flag'] = Flags['Flag']

# Mitalimäärä väkilukuun nähden
df.loc[df['Medals (Total)'] > 0, 'Medals (Per capita)'] = df['Medals (Total)'] / df['Population'] * 1000000 
df['Medals (Per capita)'] = df['Medals (Per capita)'].fillna(0)     # Tää on niille kenel ei ollu yhtää mitalia, muuten ne saa inf
df.loc[df['Medals (Per capita)'] == inf, 'Medals (Per capita)'] = 0

# Vähän tyyppien muuttelua
df = df.astype({'Medals (Total)': int, 'Gold': int, 'Silver': int, 'Bronze': int,          # Tehdään näistä kokonaislukuja ettei tuu desimaaleja
                'Medals (Summer)': int, 'SO_Gold': int, 'SO_Silver': int, 'SO_Bronze': int,
                'Hosts (Total)': int, 'Hosts (Summer)': int, 'Hosts (Winter)': int})

# Poistetaan turhia sarakkeita
df = df.drop(df.columns[[22, 23, 24, 25, 26, 33]], axis=1)

lajit = MedalsBySport.columns.values.tolist()

for laji in lajit:
    df[laji] = MedalsBySport[laji]
    df[laji] = df[laji].fillna(0)
    df[laji] = df[laji].astype(int)

koodittomat = {
    "Bohemia": "XBO",
    "British West Indies": "XBI",
    "Republic of China": "XRC",
    "Czechoslovakia": "XCS",
    "East Germany": "XEG",
    "United Team of Germany": "XUG",
    "West Germany": "XWG",
    "Independent Olympic Participants": "XIP",
    "Korea": "XKR",
    "Kosovo": "XKO",
    "Malaya": "XML",
    "Marshall Islands": "XMI",
    "Montenegro": "MNE",
    "North Borneo": "XNB",
    "Russian Empire": "XRE",
    "Saar": "XSA",
    "Serbia and Montenegro": "XSM",
    "Singapore": "SGP",
    "Soviet Union": "XSU",
    "Sudan, South": "SSD",
    "Unified Team": "XUT",
    "North Yemen": "XNY",
    "South Yemen": "XSY",
    "Yugoslavia": "XYS"
}
for ryhma_avain in koodittomat:
    df.loc[df['Nation']==ryhma_avain, 'id'] = koodittomat[ryhma_avain]
    
df['iidee'] = df['id']

df.set_index('iidee', inplace = True)

# Tehdään dataframesta csv-tiedosto
df.to_csv('datacsv.csv', index=False, float_format='%.2f')
df.to_json('tietorakenne.json', orient='index')