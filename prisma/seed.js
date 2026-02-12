const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  
  // High to low in the dependency chain
  try {
    await prisma.evidenceFile.deleteMany({});
    await prisma.nCR.deleteMany({});
    await prisma.inspection.deleteMany({});
    await prisma.iTPItem.deleteMany({});
    await prisma.iTP.deleteMany({});
    await prisma.weldLog.deleteMany({});
    await prisma.mDRReport.deleteMany({});
    await prisma.drawing.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.client.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.welder.deleteMany({});
    await prisma.wPS.deleteMany({});
    await prisma.defectCategory.deleteMany({});
  } catch (err) {
    console.log("Error during cleanup (Table might not exist yet):", err.message);
  }

  console.log("Starting seed with password: 'password'...");

  const hashedPassword = await bcrypt.hash("password", 10);

  // 1. Roles
  const adminRole = await prisma.role.create({ data: { name: "Admin" } });
  const inspectorRole = await prisma.role.create({ data: { name: "QC_Inspector" } });
  await prisma.role.create({ data: { name: "Production" } });
  await prisma.role.create({ data: { name: "Project_Manager" } });
  await prisma.role.create({ data: { name: "Client" } });

  // 2. Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@qc.com",
      name: "Super Admin",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  const inspectorUser = await prisma.user.create({
    data: {
      email: "inspector@qc.com",
      name: "QC Inspector 1",
      password: hashedPassword,
      roleId: inspectorRole.id,
    },
  });

  // 3. Clients
  const clientA = await prisma.client.create({
    data: {
      name: "Global Energy Corp",
      email: "client_a@example.com",
      contact: "Mike Ross",
    },
  });

  // 4. Projects
  const projectA = await prisma.project.create({
    data: {
      name: "Offshore Platform X",
      location: "Batam",
      progress: 65,
      clientId: clientA.id,
    },
  });

  // 5. Drawings
  const drawing1 = await prisma.drawing.create({
    data: {
      projectId: projectA.id,
      number: "DWG-2024-001",
      title: "Main Deck Structure",
      revision: "A",
    },
  });

  // 6. WPS
  const wps1 = await prisma.wPS.create({
    data: {
      number: "WPS-SMAW-001",
      process: "SMAW",
      fillerMetal: "E7018",
      position: "6G",
    },
  });

  // 7. Welders
  const welder1 = await prisma.welder.create({
    data: { name: "John Doe", idNumber: "W-001", totalWelds: 150, rejectedWelds: 5, repairRate: 3.3, performance: 95 },
  });

  // 8. Weld Log
  await prisma.weldLog.create({
    data: {
      projectId: projectA.id,
      drawingId: drawing1.id,
      jointNumber: "J-01",
      welderId: welder1.id,
      wpsId: wps1.id,
      status: "PASS",
    },
  });

  // 9. ITP
  const itp1 = await prisma.iTP.create({
    data: {
      projectId: projectA.id,
      title: "Structural Fabrication ITP",
      status: "APPROVED",
      assigneeId: inspectorUser.id,
    },
  });

  const itpItem1 = await prisma.iTPItem.create({
    data: {
      itpId: itp1.id,
      stage: "Welding",
      description: "Visual inspection of full penetration joints",
      holdPoint: true,
      witnessPoint: false,
    },
  });

  // 10. Inspection & NCR
  const inspection1 = await prisma.inspection.create({
    data: {
      projectId: projectA.id,
      itpItemId: itpItem1.id,
      inspectorId: inspectorUser.id,
      status: "Rejected",
    },
  });

  await prisma.nCR.create({
    data: {
      ncrNumber: "NCR-2024-001",
      inspectionId: inspection1.id,
      title: "Undercut on Main Deck Joint",
      description: "Severe undercut found on joint J-05",
      rootCause: "Excessive current during welding",
      correctiveAction: "Grind and re-weld with proper parameters",
      status: "Open",
      category: "Welded",
      severity: "High",
    },
  });

  // 11. Defect Categories
  for (const defect of ["Crack", "Porosity", "Undercut", "Slag Inclusion"]) {
    await prisma.defectCategory.create({
      data: { name: defect, count: Math.floor(Math.random() * 50) },
    });
  }

  console.log("Seed data created successfully!");
  console.log("Login Admin: admin@qc.com / password");
  console.log("Login Inspector: inspector@qc.com / password");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
