/* ---------------------------------------------------------------
   Sämtliche Inhalte in zwei Sprachen. Wer etwas ändern will,
   ändert es hier — HTML und CSS bleiben unberührt.

   All content in two languages. To change anything, change it
   here; HTML and CSS stay untouched.
   --------------------------------------------------------------- */

const UI = {
  de: {
    "skip": "Zu den Inhalten springen",
    "kopf.rolle": "Systemadministrator · Netzwerk & IT-Infrastruktur · Erlangen",
    "kopf.cv": "Lebenslauf",
    "hinweis": "Auf die Anlagenteile tippen — die Angaben öffnen sich als Tafel.",
    "fuss.kontakt": "Kontakt",
    "zu": "Schließen",
    "ansehen": "Ansehen",
    "alle": "Alle Nachweise als eine PDF",
    "cv.datei": "assets/docs/Lebenslauf_Mohammad_Askari_Dehestani.pdf",
    "szene.alt": "Gemalte Szene: ein Funkmast im Morgenlicht, ein Monteur richtet eine Antenne aus, ein Techniker prüft die Signalstärke, daneben ein Servicefahrzeug, ein Kabelgraben und ein Technikraum mit Rack."
  },
  en: {
    "skip": "Skip to the content",
    "kopf.rolle": "System Administrator · Network & IT Infrastructure · Erlangen",
    "kopf.cv": "CV",
    "hinweis": "Tap the parts of the installation — the details open as a panel.",
    "fuss.kontakt": "Contact",
    "zu": "Close",
    "ansehen": "View",
    "alle": "All credentials in one PDF",
    "cv.datei": "assets/docs/CV_Mohammad_Askari_Dehestani_EN.pdf",
    "szene.alt": "A painted scene: a radio tower in morning light, a rigger aligning an antenna, a technician checking signal strength, a service van, a cable trench and a technical room with a rack."
  }
};

/* Nachweise. Das Feld praxis trägt das Gewicht: ein Kurs wird erst
   dadurch aussagekräftig, dass die Inhalte danach im Produktivbetrieb
   angewendet wurden.
   Credentials. The practice field carries the weight — a course only
   becomes meaningful once it was applied in production. */

const NACHWEISE = [
  { datei: "azure-administration.pdf", anbieter: "TOSINSO", jahr: "Oktober 2023",
    de: { titel: "Microsoft Azure Administration", umfang: "Nr. TCN-0005439",
          inhalt: "Verwaltung von Identitäten, virtuellen Netzwerken, Speicherkonten und virtuellen Maschinen in Azure, dazu Backup und Überwachung.",
          praxis: "Entspricht dem AZ-104-Stoff; die Prüfung lege ich in Deutschland ab. Aufbauend auf acht Jahren Windows-Server- und Virtualisierungsbetrieb." },
    en: { titel: "Microsoft Azure Administration", umfang: "no. TCN-0005439",
          inhalt: "Managing identities, virtual networks, storage accounts and virtual machines in Azure, plus backup and monitoring.",
          praxis: "Matches the AZ-104 syllabus; I am taking the exam in Germany. Built on eight years of Windows Server and virtualisation work." } },

  { datei: "azure-fundamentals.pdf", anbieter: "TOSINSO", jahr: "Oktober 2023",
    de: { titel: "Microsoft Azure Fundamentals", umfang: "Nr. TCN-0005438",
          inhalt: "Cloud-Grundlagen, Servicemodelle, Azure-Kernressourcen, Kostenmodelle und Governance.",
          praxis: "Im selben Zug wie die Azure-Administration abgeschlossen, als Einstieg in die Cloud-Themen." },
    en: { titel: "Microsoft Azure Fundamentals", umfang: "no. TCN-0005438",
          inhalt: "Cloud concepts, service models, core Azure resources, pricing models and governance.",
          praxis: "Completed alongside Azure Administration as an entry point into the cloud topics." } },

  { datei: "mcsa-windows-server.pdf", anbieter: "TOSINSO", jahr: "Mai 2023",
    de: { titel: "MCSA Windows Server 2022", umfang: "Nr. TCN-0004102",
          inhalt: "Active Directory, Gruppenrichtlinien, DNS und DHCP, IIS, Dateidienste, Failover und Serverhärtung.",
          praxis: "Systematische Auffrischung neben dem laufenden Betrieb: Active Directory, GPO, IIS und FTP administriere ich seit 2017 im Produktivbetrieb." },
    en: { titel: "MCSA Windows Server 2022", umfang: "no. TCN-0004102",
          inhalt: "Active Directory, Group Policy, DNS and DHCP, IIS, file services, failover and server hardening.",
          praxis: "A systematic refresher alongside daily work: I have administered Active Directory, GPO, IIS and FTP in production since 2017." } },

  { datei: "lpic-2.pdf", anbieter: "TOSINSO", jahr: "Mai 2023",
    de: { titel: "LPIC 2 — Linux Engineer", umfang: "Nr. TCN-0004153",
          inhalt: "Kernel, Dateisysteme, Netzwerkdienste, Systemwartung, Fehlersuche und Absicherung im Serverbetrieb.",
          praxis: "Vertiefung der Praxis aus dem Betrieb von Ubuntu-, CentOS- und Debian-Servern seit 2015, einschließlich SSH-basierter Backups und Samba." },
    en: { titel: "LPIC 2 — Linux Engineer", umfang: "no. TCN-0004153",
          inhalt: "Kernel, file systems, network services, system maintenance, troubleshooting and hardening in server operation.",
          praxis: "Deepened the practice from running Ubuntu, CentOS and Debian servers since 2015, including SSH-based backups and Samba." } },

  { datei: "lpic-1.pdf", anbieter: "TOSINSO", jahr: "Mai 2023",
    de: { titel: "LPIC 1 — Linux Administrator", umfang: "Nr. TCN-0004152",
          inhalt: "Systemarchitektur, Paketverwaltung, Dateisysteme, Shell-Scripting sowie Benutzer- und Rechteverwaltung.",
          praxis: "Formalisierung der täglichen Linux-Arbeit; die Inhalte waren zu diesem Zeitpunkt bereits mehrjährige Routine." },
    en: { titel: "LPIC 1 — Linux Administrator", umfang: "no. TCN-0004152",
          inhalt: "System architecture, package management, file systems, shell scripting, user and permission management.",
          praxis: "Formalised the daily Linux work; by then the material had been routine for several years." } },

  { datei: "linux-essentials.pdf", anbieter: "TOSINSO", jahr: "Mai 2023",
    de: { titel: "LPI Linux Essentials", umfang: "Nr. TCN-0004151",
          inhalt: "Grundlagen von Linux und quelloffener Software, Kommandozeile, Dateiverwaltung und einfache Skripte.",
          praxis: "Einstiegsstufe der LPI-Reihe, gemeinsam mit LPIC 1 und LPIC 2 abgeschlossen." },
    en: { titel: "LPI Linux Essentials", umfang: "no. TCN-0004151",
          inhalt: "Linux and open source fundamentals, the command line, file management and basic scripting.",
          praxis: "The entry level of the LPI track, completed together with LPIC 1 and LPIC 2." } },

  { datei: "ccna.pdf", anbieter: "Maktabkhooneh", jahr: "Mai 2023",
    de: { titel: "Cisco CCNA 200-301", umfang: "58 Stunden · Nr. MK-PECLJ0",
          inhalt: "TCP/IP, Subnetting, VLAN, Spanning Tree, statisches und dynamisches Routing mit OSPF, Zugriffslisten und NAT.",
          praxis: "Ordnet die Routing-Praxis systematisch: OSPF im ISP-Umfeld über mehrere Städte betreibe ich seit 2015, dazu MPLS und VPLS." },
    en: { titel: "Cisco CCNA 200-301", umfang: "58 hours · no. MK-PECLJ0",
          inhalt: "TCP/IP, subnetting, VLAN, spanning tree, static and dynamic routing with OSPF, access lists and NAT.",
          praxis: "Systematised the routing practice: I have run OSPF in an ISP environment across several cities since 2015, plus MPLS and VPLS." } },

  { datei: "python-fortgeschritten.pdf", anbieter: "Maktabkhooneh", jahr: "Januar 2023",
    de: { titel: "Advanced Python Programming", umfang: "56 Stunden · Nr. MK-GY99YX",
          inhalt: "Fortgeschrittene Sprachmittel, Datenstrukturen, REST-APIs, Fehlerbehandlung und sauberer Aufbau größerer Skripte.",
          praxis: "Automatisierung war zu diesem Zeitpunkt bereits Alltag: Skripte für Netzwerkgeräte, Zabbix-API und POP-Wartung, darunter die Bereinigung von rund 300 Geräten." },
    en: { titel: "Advanced Python Programming", umfang: "56 hours · no. MK-GY99YX",
          inhalt: "Advanced language features, data structures, REST APIs, error handling and structuring larger scripts.",
          praxis: "Automation was already daily work by then: scripts for network devices, the Zabbix API and POP maintenance, including the cleanup of around 300 devices." } },

  { datei: "python-grundlagen.pdf", anbieter: "Maktabkhooneh", jahr: "Dezember 2022",
    de: { titel: "Python Programming for Beginners", umfang: "57 Stunden · Nr. MK-CA7JM5",
          inhalt: "Sprachgrundlagen, Kontrollstrukturen, Funktionen, Dateiverarbeitung und erste Automatisierung.",
          praxis: "Grundkurs der Python-Reihe, unmittelbar gefolgt vom Aufbaukurs." },
    en: { titel: "Python Programming for Beginners", umfang: "57 hours · no. MK-CA7JM5",
          inhalt: "Language fundamentals, control structures, functions, file handling and first steps in automation.",
          praxis: "The foundation course of the Python track, followed immediately by the advanced course." } }
];

const PROJEKTE = [
  { de: { tag: "Richtfunk", titel: "180 km Point-to-Point über die Straße von Hormus",
          text: "Planung, Aufbau und Betrieb einer Richtfunkstrecke zwischen Qeshm und Bandar Abbas, einschließlich Standortwahl, Ausrichtung und Dauerüberwachung unter maritimen Bedingungen.",
          zahlen: [["180 km", "Streckenlänge"], ["5,8 GHz", "Frequenzband"]] },
    en: { tag: "Microwave link", titel: "180 km point-to-point across the Strait of Hormuz",
          text: "Planning, construction and operation of a microwave link between Qeshm and Bandar Abbas, including site selection, alignment and continuous monitoring under maritime conditions.",
          zahlen: [["180 km", "link distance"], ["5.8 GHz", "frequency band"]] } },

  { de: { tag: "Incident Response", titel: "300 kompromittierte Netzwerkgeräte bereinigt",
          text: "Nach einem Sicherheitsvorfall entwickelte ich ein Python-Skript für automatisierte Anmeldung, Bereinigung und Härtung. Die manuelle Bearbeitung hätte etwa drei Wochen gedauert.",
          zahlen: [["< 1 h", "statt 3 Wochen"], ["~300", "Geräte"]] },
    en: { tag: "Incident response", titel: "300 compromised network devices remediated",
          text: "After a security incident I wrote a Python script that automated login, cleanup and hardening. Handling it manually would have taken around three weeks.",
          zahlen: [["< 1 h", "instead of 3 weeks"], ["~300", "devices"]] } },

  { de: { tag: "Virtualisierung", titel: "P2V-Migration im laufenden Produktivbetrieb",
          text: "Überführung produktiver Systeme in virtuelle Umgebungen ohne Neuinstallation, inklusive Treiber- und Hardwareanpassung. Ergebnis: kürzere Wiederherstellungszeiten und Hardwareunabhängigkeit.",
          zahlen: [["0", "Neuinstallationen"], ["3", "Hypervisoren"]] },
    en: { tag: "Virtualisation", titel: "P2V migration during live production",
          text: "Moved production systems into virtual environments without reinstallation, including driver and hardware adaptation. The result: shorter recovery times and hardware independence.",
          zahlen: [["0", "reinstallations"], ["3", "hypervisors"]] } },

  { de: { tag: "Industrie-IT", titel: "Virtualisierung von SIMATIC- und WinCC-Steuerungen",
          text: "Windows-basierte Steuerungssysteme für 80-Tonnen-Containerumschlagfahrzeuge virtualisiert und abgesichert, anschließend auf handelsüblichen Mini-PCs in Betrieb genommen.",
          zahlen: [["80 t", "Fahrzeugklasse"], ["SCADA", "Umfeld"]] },
    en: { tag: "Industrial IT", titel: "Virtualising SIMATIC and WinCC control systems",
          text: "Virtualised and hardened Windows-based control systems for 80-tonne container handling vehicles, then commissioned them on off-the-shelf mini-PCs.",
          zahlen: [["80 t", "vehicle class"], ["SCADA", "environment"]] } }
];

const STATIONEN = [
  { de: { titel: "IT-Infrastruktur-Spezialist / Systemadministrator", meta: "PEJAM GULF, Iran · Februar 2020 – Dezember 2025",
          punkte: ["Netzwerk-Redesign und Aufbau virtualisierter Serverumgebungen mit Proxmox VE, VMware ESXi und Hyper-V.",
                   "P2V-Migration produktiver Systeme im laufenden Betrieb, ohne Neuinstallation.",
                   "Virtualisierung und Absicherung von SIMATIC- und WinCC-Steuerungen für 80-t-Umschlagfahrzeuge.",
                   "Windows Server mit Active Directory, GPO, IIS und FTP sowie Linux-Server; automatisierter SSH-Backup-Server.",
                   "LAN, WAN und WLAN mit OSPF-Routing; Automatisierung per Python, Monitoring mit PRTG und The Dude."] },
    en: { titel: "IT Infrastructure Specialist / System Administrator", meta: "PEJAM GULF, Iran · February 2020 – December 2025",
          punkte: ["Network redesign and deployment of virtualised server environments with Proxmox VE, VMware ESXi and Hyper-V.",
                   "P2V migration of production systems during live operation, without reinstallation.",
                   "Virtualisation and hardening of SIMATIC and WinCC control systems for 80-tonne handling vehicles.",
                   "Windows Server with Active Directory, GPO, IIS and FTP plus Linux servers; automated SSH backup server.",
                   "LAN, WAN and WLAN with OSPF routing; automation via Python, monitoring with PRTG and The Dude."] } },

  { de: { titel: "IT-Infrastruktur-Spezialist / Netzwerkadministrator", meta: "FARDAD AZARAKHSH, Iran · März 2017 – Januar 2020",
          punkte: ["Windows- und Linux-Serverlandschaft: IIS, FTP, Firewall, Fernwartung und Systemhärtung.",
                   "WLAN-Mesh auf fünf Hektar Industriegelände mit MikroTik CAPsMAN und Hotspot.",
                   "Automatisierte Backups mit Veeam, Hyper-V Replication und KLS Backup.",
                   "LTE-Rollouts und OSPF-Routing in mehreren Städten; passive, aktive und Backbone-Netze."] },
    en: { titel: "IT Infrastructure Specialist / Network Administrator", meta: "FARDAD AZARAKHSH, Iran · March 2017 – January 2020",
          punkte: ["Windows and Linux server landscape: IIS, FTP, firewall, remote maintenance and system hardening.",
                   "WLAN mesh across a five-hectare industrial site with MikroTik CAPsMAN and hotspot.",
                   "Automated backups with Veeam, Hyper-V Replication and KLS Backup.",
                   "LTE rollouts and OSPF routing across several cities; passive, active and backbone networks."] } },

  { de: { titel: "Netzwerkspezialist / NOC-Techniker", meta: "Sari System, Hormoz Net, Dehkade Ertebatat Dorbord, Iran · Mai 2015 – Februar 2017",
          punkte: ["Sicherheitsvorfall mit rund 300 kompromittierten Geräten: Python-Skript senkte die Bearbeitung von drei Wochen auf unter eine Stunde.",
                   "180 km Point-to-Point-Richtfunkstrecke zwischen Qeshm und Bandar Abbas.",
                   "Drahtlose Backbone- und Weitverkehrsnetze (MPLS, VPLS, OSPF, RIP); PPPoE- und VPN-Server für rund 15 Gebiete.",
                   "Monitoring und NOC mit PRTG, The Dude, Zabbix und Grafana; Zabbix-APIs und Automatisierungsskripte."] },
    en: { titel: "Network Specialist / NOC Technician", meta: "Sari System, Hormoz Net, Dehkade Ertebatat Dorbord, Iran · May 2015 – February 2017",
          punkte: ["Security incident with roughly 300 compromised devices: a Python script cut remediation from three weeks to under an hour.",
                   "180 km point-to-point microwave link between Qeshm and Bandar Abbas.",
                   "Wireless backbone and wide-area networks (MPLS, VPLS, OSPF, RIP); PPPoE and VPN servers for around 15 areas.",
                   "Monitoring and NOC with PRTG, The Dude, Zabbix and Grafana; Zabbix APIs and automation scripts."] } },

  { de: { titel: "Servicemitarbeiter (Teilzeit, berufsbegleitend zur Stellensuche)", meta: "McDonald’s, Herzogenaurach · seit März 2026",
          punkte: ["Tägliche Kundenkommunikation auf Deutsch in einem schnelllebigen Umfeld sowie Schichtkoordination im Team."] },
    en: { titel: "Service Employee (part-time, alongside the job search)", meta: "McDonald’s, Herzogenaurach · since March 2026",
          punkte: ["Daily customer communication in German in a fast-paced environment and shift coordination within the team."] } }
];

const KENNTNISSE = [
  { de: ["Virtualisierung und Server", "VMware vSphere, ESXi und vCenter, Hyper-V, Proxmox VE, KVM, P2V-Migration, Windows Server, Active Directory, Gruppenrichtlinien, IIS, Linux (Ubuntu, CentOS, Debian), Samba"],
    en: ["Virtualisation and servers", "VMware vSphere, ESXi and vCenter, Hyper-V, Proxmox VE, KVM, P2V migration, Windows Server, Active Directory, Group Policy, IIS, Linux (Ubuntu, CentOS, Debian), Samba"] },
  { de: ["Netzwerktechnik", "LAN und WAN, TCP/IP, VLAN, QoS, NAT, OSPF, BGP, RIP, MPLS, VPLS, VPN (IPSec, OpenVPN, L2TP), DHCP, DNS, SNMP"],
    en: ["Networking", "LAN and WAN, TCP/IP, VLAN, QoS, NAT, OSPF, BGP, RIP, MPLS, VPLS, VPN (IPSec, OpenVPN, L2TP), DHCP, DNS, SNMP"] },
  { de: ["WLAN und Richtfunk", "2,4/5/6 GHz, Mesh, CAPsMAN, WDS, MikroTik RouterOS, Ubiquiti UniFi und airMAX, Mimosa, Point-to-Point-Richtfunk, Cisco IOS"],
    en: ["WLAN and microwave", "2.4/5/6 GHz, mesh, CAPsMAN, WDS, MikroTik RouterOS, Ubiquiti UniFi and airMAX, Mimosa, point-to-point links, Cisco IOS"] },
  { de: ["Monitoring und Automatisierung", "Zabbix, PRTG, Grafana, SolarWinds, MikroTik The Dude, Syslog, TR-069, Python, Bash, PowerShell, REST-API, JSON, YAML"],
    en: ["Monitoring and automation", "Zabbix, PRTG, Grafana, SolarWinds, MikroTik The Dude, Syslog, TR-069, Python, Bash, PowerShell, REST API, JSON, YAML"] },
  { de: ["Cloud, Backup und Sicherheit", "Microsoft Azure (VMs, Netzwerke, Storage, Backup, Entra ID), Veeam, Hyper-V Replication, rsync, Firewall-Administration, Incident Response, Server-Härtung, ESET, Kaspersky"],
    en: ["Cloud, backup and security", "Microsoft Azure (VMs, networking, storage, backup, Entra ID), Veeam, Hyper-V Replication, rsync, firewall administration, incident response, server hardening, ESET, Kaspersky"] },
  { de: ["Industrie-IT und Kommunikation", "Siemens SIMATIC, WinCC (SCADA/HMI), Windows-basierte SPS-Steuerungen, SIP, Asterisk, VoIP-Gateways, PPPoE-Server, Hotspot-Management"],
    en: ["Industrial IT and communications", "Siemens SIMATIC, WinCC (SCADA/HMI), Windows-based PLC control systems, SIP, Asterisk, VoIP gateways, PPPoE servers, hotspot management"] },
  { de: ["Werkzeuge", "Apache, Nginx, IIS, Wireshark, PuTTY, WinSCP, TeamViewer, Git, VS Code, Jira, WordPress"],
    en: ["Tools", "Apache, Nginx, IIS, Wireshark, PuTTY, WinSCP, TeamViewer, Git, VS Code, Jira, WordPress"] }
];

/* Die acht Tafeln. marke erscheint auch als Beschriftung im Bild. */

const TAFELN = {
  profil: {
    de: { marke: "Profil", titel: "Systemadministrator mit über zehn Jahren Praxis", art: "text",
          text: ["Aufbau, Betrieb und Absicherung von Netzwerk- und Serverinfrastrukturen in ISP-, Unternehmens- und Industrieumgebungen. Schwerpunkte sind Virtualisierung, Windows Server mit Active Directory, Linux-Administration, Netzwerktechnik und Monitoring.",
                 "Seit Januar 2026 in Deutschland mit gültigem Aufenthaltstitel und uneingeschränkter Arbeitserlaubnis. Kurzfristig verfügbar und bundesweit umzugsbereit.",
                 "Diese Seite ergänzt meinen Lebenslauf um die Nachweise und Projektbeschreibungen, für die dort kein Platz war."] },
    en: { marke: "Profile", titel: "System Administrator with over ten years of practice", art: "text",
          text: ["Designing, operating and securing network and server infrastructures across ISP, enterprise and industrial environments. The focus is virtualisation, Windows Server with Active Directory, Linux administration, networking and monitoring.",
                 "In Germany since January 2026 with a valid residence permit and unrestricted work authorisation. Available at short notice and willing to relocate nationwide.",
                 "This page supplements my CV with the credentials and project descriptions there was no room for."] }
  },
  erfahrung: {
    de: { marke: "Erfahrung", titel: "Berufserfahrung", art: "stationen" },
    en: { marke: "Experience", titel: "Professional experience", art: "stationen" }
  },
  projekte: {
    de: { marke: "Projekte", titel: "Ausgewählte Projekte", art: "projekte" },
    en: { marke: "Projects", titel: "Selected projects", art: "projekte" }
  },
  kenntnisse: {
    de: { marke: "Kenntnisse", titel: "Technische Kenntnisse", art: "kenntnisse" },
    en: { marke: "Skills", titel: "Technical skills", art: "kenntnisse" }
  },
  zertifikate: {
    de: { marke: "Zertifikate", titel: "Kursnachweise und Weiterbildungen", art: "nachweise",
          text: ["Neun Kursabschlüsse der iranischen Bildungsplattformen TOSINSO und Maktabkhooneh, alle aus den Jahren 2022 und 2023. Prüfungszentren für Herstellerzertifizierungen waren im Iran nicht verfügbar; die AZ-104-Prüfung lege ich in Deutschland ab. Die Kurse ordnen eine Praxis, die zu diesem Zeitpunkt bereits mehrere Jahre lief — bei jedem Eintrag steht, worauf sie aufbaut."] },
    en: { marke: "Credentials", titel: "Course credentials and further training", art: "nachweise",
          text: ["Nine course certificates from the Iranian learning platforms TOSINSO and Maktabkhooneh, all from 2022 and 2023. Testing centres for vendor certifications were not available in Iran; I am taking the AZ-104 exam in Germany. The courses formalise practice that had been running for years — each entry states what it builds on."] }
  },
  ausbildung: {
    de: { marke: "Ausbildung", titel: "Ausbildung", art: "paar",
          paare: [["Abschluss", "Zweijähriger Hochschulabschluss (Kardani)"],
                  ["Fachrichtung", "Computer-Softwaretechnik"],
                  ["Hochschule", "Islamische Azad Universität, Iran"],
                  ["Zeitraum", "2013 – 2015"]] },
    en: { marke: "Education", titel: "Education", art: "paar",
          paare: [["Degree", "Two-year higher education degree (Kardani)"],
                  ["Field", "Computer Software Engineering"],
                  ["University", "Islamic Azad University, Iran"],
                  ["Period", "2013 – 2015"]] }
  },
  sprachen: {
    de: { marke: "Sprachen", titel: "Sprachen", art: "paar",
          paare: [["Persisch", "Muttersprache"],
                  ["Deutsch", "B1"],
                  ["Englisch", "Technisches Leseverständnis (Fachdokumentation)"]] },
    en: { marke: "Languages", titel: "Languages", art: "paar",
          paare: [["Persian", "Native language"],
                  ["German", "B1"],
                  ["English", "Technical reading comprehension (documentation)"]] }
  },
  konsole: {
    de: { marke: "Konsole", titel: "Zwei Sitzungen beim Einpegeln der Strecke", art: "konsole",
          text: ["Links die Cisco-Seite mit OSPF-Nachbarschaft, rechts das MikroTik-Gegenüber beim Ausrichten der Antenne. Die Signalstärke im Bild stammt aus dem align-Befehl."] },
    en: { marke: "Console", titel: "Two sessions while aligning the link", art: "konsole",
          text: ["On the left the Cisco side with its OSPF adjacency, on the right the MikroTik counterpart while aligning the antenna. The signal reading in the illustration comes from the align command."] }
  },
  kontakt: {
    de: { marke: "Technikraum", titel: "Kontakt und Unterlagen", art: "paar",
          text: ["Im Rack laufen die Antennenkabel über die Trasse auf das Patchpanel und von dort auf Switch, Router und Firewall — die Anlage endet hier."],
          paare: [["E-Mail", '<a href="mailto:moli1369@gmail.com">moli1369@gmail.com</a>'],
                  ["Telefon", '<a href="tel:+491633666009">+49 163 3666009</a>'],
                  ["LinkedIn", '<a href="https://linkedin.com/in/mohamad-askari" rel="noopener">mohamad-askari</a>'],
                  ["Raum", "Nürnberg-Erlangen, bundesweit umzugsbereit"]] },
    en: { marke: "Technical room", titel: "Contact and documents", art: "paar",
          text: ["Inside the rack the antenna cables run through the trench onto the patch panel and from there to switch, router and firewall — the installation ends here."],
          paare: [["Email", '<a href="mailto:moli1369@gmail.com">moli1369@gmail.com</a>'],
                  ["Phone", '<a href="tel:+491633666009">+49 163 3666009</a>'],
                  ["LinkedIn", '<a href="https://linkedin.com/in/mohamad-askari" rel="noopener">mohamad-askari</a>'],
                  ["Region", "Nuremberg-Erlangen, willing to relocate nationwide"]] }
  }
};


/* Die beiden Konsolen, die der Techniker am Rechner offen hat.
   Links die Cisco-Seite der Strecke, rechts das MikroTik-Gegenüber
   beim Einpegeln der Antenne. Die Befehle sind echt. */

const KONSOLEN = [
  {
    kopf: "cisco ios — R1",
    zeilen: [
      ["Router> ", "enable"],
      ["Router# ", "configure terminal"],
      ["R1(config)# ", "interface GigabitEthernet0/1"],
      ["R1(config-if)# ", "ip address 10.10.0.1 255.255.255.252"],
      ["R1(config-if)# ", "no shutdown"],
      ["R1(config-if)# ", "exit"],
      ["R1(config)# ", "router ospf 10"],
      ["R1(config-router)# ", "network 10.10.0.0 0.0.255.255 area 0"],
      ["R1(config-router)# ", "passive-interface default"],
      ["R1(config-router)# ", "end"],
      ["R1# ", "show ip ospf neighbor"],
      ["", "Neighbor ID   Pri  State     Dead Time  Interface"],
      ["", "10.10.0.2       1  FULL/DR   00:00:36   Gi0/1"],
      ["R1# ", "write memory"],
      ["", "Building configuration... [OK]"]
    ]
  },
  {
    kopf: "routeros — MT-Hormuz",
    zeilen: [
      ["[admin@MT-Hormuz] > ", "/interface wireless"],
      ["  > ", "set wlan1 band=5ghz-a/n frequency=5800 mode=bridge"],
      ["  > ", "set wlan1 distance=dynamic tx-power=25"],
      ["  > ", "/interface wireless align"],
      ["", "signal -71 dBm   ausrichten ..."],
      ["", "signal -66 dBm   ausrichten ..."],
      ["", "signal -62 dBm   ok"],
      ["  > ", "/ip address add address=10.20.0.1/30 interface=wlan1"],
      ["  > ", "/routing ospf network add network=10.20.0.0/30 area=backbone"],
      ["  > ", "/system script run backup-ssh"],
      ["", "link established   distance 180 km"],
      ["", "ccq 96 %   tx/rx 300/300 Mbps"]
    ]
  }
];

const REIHENFOLGE = ["profil", "erfahrung", "projekte", "kenntnisse", "zertifikate", "ausbildung", "sprachen", "konsole", "kontakt"];
