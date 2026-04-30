"""Generate Tour Planner Wireframes as a .drawio file."""
import xml.etree.ElementTree as ET

def cell(parent, id, value="", style="", x=0, y=0, w=100, h=40, vertex=1, pid="1"):
    c = ET.SubElement(parent, "mxCell", id=str(id), value=value, style=style, vertex=str(vertex), parent=pid)
    ET.SubElement(c, "mxGeometry", x=str(x), y=str(y), width=str(w), height=str(h)).set("as","geometry")
    return c

def make_page(name, build_fn):
    d = ET.Element("diagram", name=name)
    g = ET.SubElement(d, "mxGraphModel")
    r = ET.SubElement(g, "root")
    ET.SubElement(r, "mxCell", id="0")
    ET.SubElement(r, "mxCell", id="1", parent="0")
    build_fn(r)
    return d

ID = [10]
def nid():
    ID[0] += 1
    return str(ID[0])

BOX = "rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;"
BTN = "rounded=1;whiteSpace=wrap;html=1;fillColor=#0050ef;fontColor=#ffffff;strokeColor=none;fontSize=14;fontStyle=1;"
INPUT = "rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#999999;align=left;spacingLeft=8;"
HEADER = "rounded=0;whiteSpace=wrap;html=1;fillColor=#1a1a2e;fontColor=#ffffff;fontSize=16;fontStyle=1;"
LABEL = "text;html=1;align=left;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontColor=#333;"
SIDEBAR = "rounded=0;whiteSpace=wrap;html=1;fillColor=#e8e8e8;strokeColor=#cccccc;verticalAlign=top;fontStyle=1;fontSize=13;"
MAP = "rounded=1;whiteSpace=wrap;html=1;fillColor=#d4edda;strokeColor=#28a745;fontSize=14;fontStyle=2;"
TABLE_H = "rounded=0;whiteSpace=wrap;html=1;fillColor=#343a40;fontColor=#ffffff;fontSize=11;fontStyle=1;"
TABLE_R = "rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#dee2e6;fontSize=10;align=left;spacingLeft=4;"
TITLE = "text;html=1;fontSize=20;fontStyle=1;align=center;fillColor=none;strokeColor=none;fontColor=#1a1a2e;"

def build_login(r):
    cell(r, nid(), "TOUR PLANNER", TITLE, 150, 30, 300, 40)
    cell(r, nid(), "", BOX, 130, 90, 340, 350)
    cell(r, nid(), "Login", "text;html=1;fontSize=18;fontStyle=1;fillColor=none;strokeColor=none;fontColor=#0050ef;", 150, 100, 80, 30)
    cell(r, nid(), "Register", "text;html=1;fontSize=14;fillColor=none;strokeColor=none;fontColor=#999;", 350, 105, 80, 25)
    cell(r, nid(), "Username", LABEL, 160, 155, 80, 20)
    cell(r, nid(), "", INPUT, 160, 175, 280, 35)
    cell(r, nid(), "Password", LABEL, 160, 225, 80, 20)
    cell(r, nid(), "********", INPUT, 160, 245, 280, 35)
    cell(r, nid(), "Remember me", LABEL, 185, 295, 100, 20)
    cell(r, nid(), "LOGIN", BTN, 160, 330, 280, 45)
    cell(r, nid(), "Forgot password?", "text;html=1;fontSize=11;fillColor=none;strokeColor=none;fontColor=#0050ef;fontStyle=4;", 220, 390, 120, 20)

def build_dashboard(r):
    cell(r, nid(), "Tour Planner         [Search...]                          User | Logout", HEADER, 0, 0, 900, 50)
    # Sidebar
    cell(r, nid(), "TOURS", SIDEBAR, 0, 50, 220, 500)
    cell(r, nid(), "+ New Tour", BTN, 15, 70, 190, 35)
    cell(r, nid(), "Filter: [All Types]", LABEL, 15, 115, 140, 20)
    # Tour items
    for i, (name, route, typ) in enumerate([
        ("Donauradweg", "Wien - Linz", "Bike"),
        ("Schneeberg", "Puchberg - Gipfel", "Hike"),
        ("Prater Run", "Praterstern - Lusthaus", "Run"),
        ("Kahlenberg", "Heiligenstadt - Gipfel", "Hike"),
    ]):
        yy = 150 + i * 75
        st = BOX if i > 0 else "rounded=1;whiteSpace=wrap;html=1;fillColor=#e3f2fd;strokeColor=#0050ef;fontColor=#333;"
        cell(r, nid(), f"<b>{name}</b><br><span style='font-size:10px'>{route} | {typ}</span>", st, 15, yy, 190, 60)
    # Map
    cell(r, nid(), "[ Leaflet Map Area ]<br>OpenStreetMap + Route Overlay", MAP, 240, 60, 640, 280)
    # Tour Info
    cell(r, nid(), "", BOX, 240, 355, 640, 180)
    cell(r, nid(), "Donauradweg", "text;html=1;fontSize=16;fontStyle=1;fillColor=none;strokeColor=none;fontColor=#1a1a2e;align=left;", 255, 360, 200, 25)
    for j, txt in enumerate(["From: Wien | To: Linz", "Type: Bike | Distance: 315 km", "Est. Time: 12h | Popularity: ★★★★★", "Child-Friendly: ✔ Yes"]):
        cell(r, nid(), txt, LABEL, 255, 390 + j * 22, 300, 20)
    cell(r, nid(), "Edit", BTN.replace("#0050ef","#6c757d"), 560, 490, 70, 30)
    cell(r, nid(), "Delete", BTN.replace("#0050ef","#dc3545"), 640, 490, 70, 30)
    cell(r, nid(), "Export", BTN.replace("#0050ef","#28a745"), 720, 490, 70, 30)
    cell(r, nid(), "Tours: 4 | Logs: 12", "rounded=0;whiteSpace=wrap;html=1;fillColor=#f8f9fa;strokeColor=#dee2e6;fontSize=10;", 0, 550, 900, 25)

def build_detail(r):
    cell(r, nid(), "<- Back    Tour: Donauradweg                              User | Logout", HEADER, 0, 0, 900, 50)
    cell(r, nid(), "[ Leaflet Map - Full Width Route Display ]", MAP, 10, 60, 880, 200)
    cell(r, nid(), "", BOX, 10, 270, 880, 80)
    cell(r, nid(), "<b>Donauradweg</b> | Wien → Linz | Bike | 315km | 12h | Pop: ★★★★★ | Child: ✔", LABEL, 25, 280, 700, 20)
    cell(r, nid(), "Schoene Radtour entlang der Donau durch die Wachau...", LABEL, 25, 310, 500, 20)
    cell(r, nid(), "[Edit] [Delete] [Export]", LABEL, 700, 310, 170, 20)
    # Tour Logs header
    cell(r, nid(), "TOUR LOGS                                                    + Add Log", "text;html=1;fontSize=14;fontStyle=1;fillColor=none;strokeColor=none;fontColor=#1a1a2e;", 10, 360, 880, 25)
    cols = ["Date","Comment","Difficulty","Distance","Time","Rating","Actions"]
    ws = [90,230,90,80,70,80,80]
    xx = 10
    for c, w in zip(cols, ws):
        cell(r, nid(), c, TABLE_H, xx, 390, w, 30)
        xx += w
    for row_i, row in enumerate([
        ["15.04.26","Sonnig, tolle Aussicht","Medium","310 km","11:30h","★★★★","Edit|Del"],
        ["22.04.26","Regen, anstrengend","Hard","320 km","13:00h","★★★","Edit|Del"],
    ]):
        xx = 10
        for val, w in zip(row, ws):
            cell(r, nid(), val, TABLE_R, xx, 420 + row_i*30, w, 30)
            xx += w

def build_add_tour(r):
    cell(r, nid(), "", BOX, 100, 30, 400, 440)
    cell(r, nid(), "Create New Tour                                    ✕", "text;html=1;fontSize=16;fontStyle=1;fillColor=none;strokeColor=none;fontColor=#1a1a2e;align=left;spacingLeft=10;", 100, 35, 400, 30)
    fields = ["Name","Description","From","To","Transport Type"]
    for i, f in enumerate(fields):
        cell(r, nid(), f, LABEL, 120, 80 + i*55, 120, 20)
        cell(r, nid(), "[Dropdown]" if f=="Transport Type" else "", INPUT, 120, 100 + i*55, 360, 32)
    cell(r, nid(), "--- Auto-computed (read-only) ---", "text;html=1;fontSize=10;fontStyle=2;fillColor=none;strokeColor=none;fontColor=#999;", 120, 365, 200, 15)
    cell(r, nid(), "Distance: [via API]  |  Est. Time: [via API]", LABEL, 120, 385, 300, 20)
    cell(r, nid(), "Cancel", BTN.replace("#0050ef","#6c757d"), 120, 420, 160, 38)
    cell(r, nid(), "Save Tour", BTN, 310, 420, 170, 38)

def build_add_log(r):
    cell(r, nid(), "", BOX, 100, 30, 400, 400)
    cell(r, nid(), "Add Tour Log                                        ✕", "text;html=1;fontSize=16;fontStyle=1;fillColor=none;strokeColor=none;fontColor=#1a1a2e;align=left;spacingLeft=10;", 100, 35, 400, 30)
    fields = ["Date / Time","Comment","Difficulty","Total Distance","Total Time","Rating"]
    for i, f in enumerate(fields):
        cell(r, nid(), f, LABEL, 120, 75 + i*48, 120, 20)
        h = 32 if f != "Rating" else 25
        val = "[Easy|Medium|Hard]" if f=="Difficulty" else "★ ★ ★ ★ ★" if f=="Rating" else ""
        cell(r, nid(), val, INPUT, 120, 95 + i*48, 360, h)
    cell(r, nid(), "Cancel", BTN.replace("#0050ef","#6c757d"), 120, 380, 160, 38)
    cell(r, nid(), "Save Log", BTN, 310, 380, 170, 38)

def build_flow(r):
    cell(r, nid(), "UI FLOW DIAGRAM - Tour Planner", TITLE, 200, 10, 400, 35)
    boxes = [("Login /\nRegister",300,70,160,60), ("Dashboard\n(Tour List + Map)",270,200,220,60),
             ("Add/Edit\nTour",80,350,140,55), ("Tour\nDetail",400,350,140,55),
             ("Add/Edit\nTour Log",350,470,140,55), ("Import /\nExport",530,470,140,55)]
    ids = []
    for label,x,y,w,h in boxes:
        i = nid()
        ids.append(i)
        cell(r, i, label, BOX.replace("#f5f5f5","#e3f2fd").replace("#666666","#0050ef"), x,y,w,h)
    arrows = [(0,1),(1,2),(1,3),(3,4),(3,5),(2,1),(3,1),(4,3)]
    for s,t in arrows:
        a = ET.SubElement(r, "mxCell", id=nid(), style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#333;", edge="1", parent="1", source=ids[s], target=ids[t])
        ET.SubElement(a, "mxGeometry", relative="1").set("as","geometry")

# Build file
root = ET.Element("mxfile")
for name, fn in [("1 - Login", build_login), ("2 - Dashboard", build_dashboard),
                  ("3 - Tour Detail", build_detail), ("4 - Add Tour", build_add_tour),
                  ("5 - Add Tour Log", build_add_log), ("6 - UI Flow", build_flow)]:
    root.append(make_page(name, fn))

tree = ET.ElementTree(root)
out = r"d:\iCloudDrive_NEW\iCloudDrive\Dokumente\Studium\FH\Schule\SS 26 - 4 Sem\SWEN\03_Semesterprojekt_TourPlanner\docs\TourPlanner_Wireframes.drawio"
ET.indent(tree)
tree.write(out, encoding="utf-8", xml_declaration=True)
print(f"OK: {out}")
