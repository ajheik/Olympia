import streamlit as st
import altair as alt
import pandas as pd
from vega_datasets import data
import Database.Database
from tinydb import TinyDB, Query

df = pd.read_csv('Olympics.csv')
df.set_index('Code', inplace = True)
koodit = pd.read_csv('country-codes.csv')
koodit.set_index('IOC', inplace = True)
koodit = koodit[~koodit.index.duplicated()]

df['id'] = koodit['ISO3166-1-numeric']

# print(df)       # Testi tulostus
# print(koodit)   # Testi tulostus
# df2 = pd.read_json('testi.json')   # Testasin vähän erilaisia json-rakenteita
# print(df2)

# Otsikko ja selectbox
st.set_page_config(layout="wide", page_title='Olympiaprojekti') 
st.write(""" # Olympiaprojekti """)
st.radio("Minkä mukaan heatmap?", ('Mitalit', 'Mitalit (per capita)', 'Lajit', 'Isännöinti'))

# Sivupalkki infoille
infot = st.sidebar
infot.header('Mitali-infot')
infot.text("Kulta: 404\nHopea: 404\nPronssi: 404\nJne.")

# Piirretään kartta
kartta = (
    alt.layer(
        alt.Chart(alt.sphere()).mark_geoshape(fill='lightblue'), # Sininen taustaväri
        alt.Chart(alt.graticule()).mark_geoshape(stroke='white', strokeWidth=0.5),  # "Verkosto"
        alt.Chart(alt.topo_feature(data.world_110m.url, "countries")).mark_geoshape(stroke="black", strokeWidth=0.5) # Itse kartta
        .transform_filter(alt.datum.id != 10) # Poistetaan etelänapa :D
        .encode(
            color=alt.Color( # Heatmap
                "Medal:N",
                scale=alt.Scale(scheme="lightorange"),
                legend=None),
            tooltip=[ # Infot mitä näkee kun kursori "hoveraa" valtion päällä
                alt.Tooltip("Nation:N", title="Valtio"),
                alt.Tooltip("Medal:Q", title="Mitalit"),
                alt.Tooltip("Gold:Q", title="Kullat"),
                alt.Tooltip("Silver:Q", title="Hopeat"),
                alt.Tooltip("Bronze:Q", title="Pronssit"),
            ],
        ).transform_lookup( # Yhdistetään kartan valtiot datan valtioiden kanssa, käyttäen kartan ISO 3166-1 numeerisiä koodeja, ja datan valtioiden lyhenteitä
            lookup="id",
            from_=alt.LookupData(df, "id", ["Nation", "Medal", "Gold", "Silver", "Bronze"])
        )
    ).configure_view(strokeWidth=0).properties(width=1300, height=700).project("naturalEarth1"))

st.write(kartta)

# Jotain ulkonäköön liittyviä säätöjä tästä eteenpäin
st.markdown("""
        <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        header {visibility: hidden;}
        </style>
        """, unsafe_allow_html=True)
st.markdown(f"""
    <style>
    .reportview-container .main .block-container{{
        max-width: {1600}px;
    }}
    </style>
    """, unsafe_allow_html=True,)