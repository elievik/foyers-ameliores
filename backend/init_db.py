from database import engine, Base, SessionLocal
from models import (
    NewsArticle, Report, HimalayenInscription, 
    AsutoSale, ResellerRequest, TeamMember, 
    ProductImage, Testimonial, Region, Partner, HeroImage,
    ContactInfo, RegionalOffice
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
    
    # Insert initial contact info
    contact_info = db.query(ContactInfo).first()
    if not contact_info:
        contact_info = ContactInfo()
        db.add(contact_info)
        db.commit()
        print("Initial contact info inserted!")
    
    # Insert initial regional offices
    initial_offices = [
        {"name": "Maritime", "city": "LOMÉ", "phone": "+228 90 05 05 05", "address": "Zone Industrielle", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuB91CwSEJ9KGk31z0xR4sVpY-wzatgeNLqjeqfdQmeq2DD3B1DUYFHIqZd4bGdcZ1tL9bjZ9eDs8pPcOxW00xcgS8fsJhTy7Z9CieBqsCxzsCO79GE9jDeBxpu9zVMN_Vb4kb81kyl7HfzIwJumMdAwKaupzNI44M352euC5xcR5HvgK5uUN6y0fFUbAYMqS-gr6BQCBbT7icZ7a1N6AIKbKezbzBRemGsevzJJqiMAcCUwQnuMU8M-4RM0jGgSEyw5TXgx24A-9g", "order": 0},
        {"name": "Plateaux", "city": "KPALIMÉ", "phone": "+228 90 04 04 04", "address": "Près du Mont Agou", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuD8STKCvvRrnXQUaNW7qPhOaBLcCFwEHJWuIUjt_iOfYdt0s7Gtr2SGFvoZ-nYnXOP94_l7RBsUtyC1gTY9QRsa0EgDTEmtBVdW6_UM4vxqBoiQjLZz_HMjfsoCyH9QDQz9vpwxOhRheBut8m2QAWMeZJ4Mp9KHKmp9D0puK0G6NXOP58StSyzYqwlw0Dp_LFHDqOzhdJ8jLYAjPUWrgZhxzTQlKMHcEm3LbbaW03kSFPbzRCAsrMFprQ2GL4ROtbwQl9pkAJch2XA", "order": 1},
        {"name": "Centrale", "city": "SOKODÉ", "phone": "+228 90 03 03 03", "address": "Route Nationale N1", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBE4Mbu1wZYXlPIQWgnaeTq3lcJZVaIcn9ZSlfZ9abz_VjQtPd8YZQfgjn2BwzEgO0vXg4j6Tf_IShbhjG-7_PYkwNTIyZgzvXW62FHaOjY-YstehnA-VIuM4KdZaWZWE9Y6oWdfnMQQ5XWDbLYGjFjVd_7QL-CBIARupd_mqYVkb1FpxgjLSpLQIi7BJczA6WJP4y4bUmz4khx03wav9nG8mWyzX82RNVAfER57Sjl2tXNHHOClbTEfLfeNMgvapQItGDhwehMRhw", "order": 2},
        {"name": "Kara", "city": "KARA CITY", "phone": "+228 90 02 02 02", "address": "Avenue de la Kozah", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCIZ9fmccqRuoFL1V2EPrmVBhgiqQZXjdYEZmPo5wG4738SAVkucBiFLABCAtPs_Ms0c90TqP_ON9-xaBD7t2KSS-55dFSx1RCdPKHbXPEn4t8jNHSO1PjENaAtVXK2YhtHitRC4sE_X8GX3T0DAM6EiyQhpSBoxaIG2kdD0gBdaXju3k0zk62jTFLxeP0FVCtTx91CJXdKvCsGNBlG8QJszYI7SGlKrGPjuV6r2TPGR3RJJORGJVHoAv935XyQoN2nDW_gZ1VXg", "order": 3},
        {"name": "Savanes", "city": "DAPAONG", "phone": "+228 90 01 01 01", "address": "Quartier Administratif", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuD2s5ie3VJKTcaIBRv0aPvUET_uXqI7_g2jGyW1IuID68lQITV2p0YkGa5wcNBl7dii3ALZygJHcvWq1XSLgyAB9xuXbDtQmC4KSu-9aB4oEbiDej7qJwedeoWD81xqv73CQ", "order": 4}
    ]
    for office_data in initial_offices:
        existing = db.query(RegionalOffice).filter(RegionalOffice.name == office_data["name"]).first()
        if not existing:
            db.add(RegionalOffice(**office_data))
    db.commit()
    print("Initial regional offices inserted or already present!")

    # Insert initial reports if they don't exist
    initial_reports = [
        {
            "title": "Rapport Annuel 2023",
            "description": "Résumé des activités et des impactes de l'année 2023",
            "file_url": ""
        },
        {
            "title": "Étude d'Impact 2024",
            "description": "Évaluation de l'impact des foyers améliorés sur la santé et l'environnement",
            "file_url": ""
        }
    ]
    for report_data in initial_reports:
        existing = db.query(Report).filter(Report.title == report_data["title"]).first()
        if not existing:
            db.add(Report(**report_data))
    db.commit()
    print("Initial reports inserted or already present!")
finally:
    db.close()
