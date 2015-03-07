// Diffuser
$fn=50;
lip_thickness = 1;
lip_overhang = 3;
hole_thickness = 8;
hole_d = 28;
protrude = 7;
thickness = 1;

difference() {
  translate([0,0,0]) cylinder(h=lip_thickness, d=lip_overhang*2+hole_d);
  translate([0,0,0]) cylinder(h=lip_thickness+hole_thickness, d=hole_d-2*thickness);
}

diameter = hole_d;
difference() {
  translate([0,0,0]) sphere(d=diameter);
  translate([0,0,0]) sphere(d=diameter-thickness);
  translate([-diameter/2,-diameter/2,-diameter+lip_thickness]) cube([diameter, diameter, diameter]);
}