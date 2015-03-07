// Diffuser
$fn=50;
lip_thickness = 1;
lip_overhang = 3;
hole_thickness = 8;
hole_d = 28;
protrude = 7;
thickness = 0.7;

difference() {
  union() {
    translate([0,0,0]) cylinder(h=lip_thickness, d=lip_overhang*2+hole_d);
    translate([0,0,lip_thickness]) cylinder(h=hole_thickness, d=hole_d);
  }
  translate([0,0,0]) cylinder(h=lip_thickness+hole_thickness, d=hole_d-2*thickness);
}

diameter = 40;
move_down = 5.2; // TODO: actually do the math
difference() {
  translate([0,0,-move_down]) sphere(d=diameter);
  translate([0,0,-move_down]) sphere(d=diameter-thickness);
  translate([-diameter/2,-diameter/2,-diameter+hole_thickness+lip_thickness]) cube([diameter, diameter, diameter]);
}