from database import engine, Base, SessionLocal
from models import (
    NewsArticle, Report, HimalayenInscription, 
    AsutoSale, ResellerRequest, TeamMember, 
    ProductImage, Testimonial, Region, Partner, HeroImage
)

# Create all tables (this will add new columns if they don't exist)
Base.metadata.create_all(bind=engine)
print("Database tables updated successfully!")

# Insert initial regions if they don't exist
db = SessionLocal()
try:
    initial_regions = [
        {
            "name": "Maritime",
            "distributed": "0",
            "icon": "waves",
            "activity": "Aucune activité enregistrée",
            "quote": "",
            "cite": "",
            "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuB28wVsxx6mWBwMfY8U3XmwaDWTaVHY7bM5pBKcncS3wh-IER_8fbxlnaRmKa4drB_4dmwo1HLS_vRMraIG8InmVgTaahPBcPh5g59_19cONAvenYkkb9D4Yrdw8uYV7FioGOnauEqTe29evnMNfadeuaRoVmRVcYhWcS3LGq9-QsZn6gpkmf9WxLWUzSgSIa16IOa7GZshgqf_6Z0o9Bqc2UCFvBJsx0qbPb-yVxUv7Toi5qx1vYS6-XDAxJ7VlnF0dTIcoZaFw",
            "order": 0
        },
        {
            "name": "Plateaux",
            "distributed": "0",
            "icon": "cloud",
            "activity": "Aucune activité enregistrée",
            "quote": "",
            "cite": "",
            "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuC5b4oMntUf_TQsSbrquIzskF0cx6QwrXDizvzCvGHftuU8HtumnAhYcOZx7101RIZqth3-fmP6pD3FXxSiTqVUArogYQnPyRzpvPF2nYAgfwLKat5gFSKlxTDZqSkhdIspsNme_dIEX06w4NbImdpGk63wrCtZAuj0CnVG24DZ1mGScCSA9-GV2tBQshNJgVESqV6JN8tz87h0Tae_G59Bjsv0-sW11wpxCyY572aofeASeBOQZ7k-I-yX5zqkxtPO5wrOFdYeA",
            "order": 1
        },
        {
            "name": "Centrale",
            "distributed": "0",
            "icon": "agriculture",
            "activity": "Aucune activité enregistrée",
            "quote": "",
            "cite": "",
            "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCkc0bdlxHBCdF8n2PxfO3_EE3afy7WNf-JC11QcmpTkD3dx41zWgCtqTeUO4XdN5zXgKrh_iSFwodvdt5JuaIb71nrGFnCxh8uoWf2Grtr07fbCkuz8zJEZJBXDDjUCl2i8b7UpcX9STKzKIRA2XCviunPNjuG1Zk4cHWrZ6ByccipSXFNSEN1mQ8n7eKD4jn_XKeUixu7U8vACgLoRpFHDmzFJm45YHz81MSPrIF7EYMq-UEWnBYgBQAWkdEkR46ubhz5phm1cA",
            "order": 2
        },
        {
            "name": "Kara",
            "distributed": "0",
            "icon": "forest",
            "activity": "Aucune activité enregistrée",
            "quote": "",
            "cite": "",
            "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDlaunG8xkV4zWuNyZhubthwdyNJbYMh8DCtQuTsqTTuHi0II4P4goOumdtyrFsjtPObKL33k_pvTSbPBJNmowr3SaY_ItXGE1qT2lmSexrnRiJcnxKarHQ058DXBa_qXJlXH1wvu6MUMGO-4943n8YZdMDa8z18PWXma5tVLS4D_h-5rxIzNYTjbnAc3t25DZgODm6vXD9ltUneagSFO-VIE3CBFdICTAbpsjRBDHP-ewVkaFL76NOQJKrw9AUDCnImPJlvmR_g",
            "order": 3
        },
        {
            "name": "Savanes",
            "distributed": "0",
            "icon": "eco",
            "activity": "Aucune activité enregistrée",
            "quote": "",
            "cite": "",
            "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAJU9ex3s_0SIeZXsaYTBweWicmDfNBJIcAiJoCbt2LUccauC0OYDl_vtwWvHQDEXVAZu2btoDTYjHgAmMWM_Enf8BTOH-hIHLpN5FHrV0zXcst9s4PgOZgqHYi5xZCjMifJ9XjT_uVxoPKPa2V1kRi5TG38TTmcK7Sq2WuZz2NbKEN1DSbfK7A99ibWW_inYT4O86pnNuD8_q1IZuh6GoKBCkhc3vfJqsjb3aPvMcPErJh9PI2pWchGu6jC6OfIvz4y1PyrK4jA",
            "order": 4
        }
    ]
    
    for region_data in initial_regions:
        existing_region = db.query(Region).filter(Region.name == region_data["name"]).first()
        if not existing_region:
            new_region = Region(**region_data)
            db.add(new_region)
    db.commit()
    print("Initial regions inserted or already present!")
    
    # Insert initial partners if they don't exist
    initial_partners = [
        {"name": "GIZ", "logo_url": "", "order": 0},
        {"name": "UNDP", "logo_url": "", "order": 1},
        {"name": "ECOWAS", "logo_url": "", "order": 2},
        {"name": "BOAD", "logo_url": "", "order": 3},
        {"name": "ATRE", "logo_url": "", "order": 4},
    ]
    
    for partner_data in initial_partners:
        existing_partner = db.query(Partner).filter(Partner.name == partner_data["name"]).first()
        if not existing_partner:
            new_partner = Partner(**partner_data)
            db.add(new_partner)
    db.commit()
    print("Initial partners inserted or already present!")
    
    # Insert initial hero images if they don't exist
    initial_heroes = [
        {
            "page": "home",
            "title": "Accueil",
            "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBl0KHpcTlVrogx_VOf2OzprIE4DMZhe4wnKssR31xDMUD7c3Ihn6X9D41qrMnoSDUgftYOMN6WLTYsduTEa2LrG7AdWuE_Q0o-83ZJJH587CTC0Phj04bY08DTBpW8mwrl2FDaTja9xDkoPo7CVSp2ifv7Qh31AT1qCKOGUJMmZA9Lz4eLEgNLJbISAC635X1adqTDNzGnhasXUEvjgPtb-nkUhd6IbPY1fpaPf66J_vg6vKKuwbUZ5uKJ7S5Emhfrc84BJdmVGg",
            "alt_text": "Une famille togolaise souriante cuisinant avec un foyer amélioré dans une cuisine moderne et écologique"
        },
        {
            "page": "about",
            "title": "À Propos",
            "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBKmeEPDBOQoGtc2dS5nEe9HF-eWi768kabmAFnbhgjH7g8SAXpa6TOzAGprzA-5PaCdQ3cn3r_ZKzS6V62Qv5EWRBUI8qebCGalEEBux0tCTJ8Moqzhx5GHr_GKYECYv_NHvaQpQNFK59E8iWRIx3qSNgcBOcK-JoM_cYFvFS063Kmx7Hn4zOanzXbn1ehyBSX69Kk8rpQJAQGKKCSMSl64Yiz3Nxd9fjNTjtNUEOAaTxHCztZM_NdZV0z_lESItqijpn1hKrpSQ",
            "alt_text": "Paysage des Plateaux au Togo au lever du soleil"
        }
    ]
    
    for hero_data in initial_heroes:
        existing_hero = db.query(HeroImage).filter(HeroImage.page == hero_data["page"]).first()
        if not existing_hero:
            new_hero = HeroImage(**hero_data)
            db.add(new_hero)
    db.commit()
    print("Initial hero images inserted or already present!")
finally:
    db.close()
