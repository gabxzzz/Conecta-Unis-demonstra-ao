export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

export function publicCompany(company) {
  if (!company) return null;
  return { ...company };
}

export function companyForUser(db, user) {
  if (!user || !user.companyId) return null;
  return db.companies.find((c) => c.id === user.companyId) || null;
}

export function findStudent(db, id) {
  return db.users.find((u) => u.id === id && u.role === 'student') || null;
}

export function enrichOpportunity(db, opportunity, viewer) {
  const company = db.companies.find((c) => c.id === opportunity.companyId);
  const applications = db.applications.filter((a) => a.opportunityId === opportunity.id);
  const myApplication = viewer
    ? applications.find((a) => a.studentId === viewer.id)
    : null;

  return {
    ...opportunity,
    company: company
      ? {
          id: company.id,
          name: company.name,
          sector: company.sector,
          city: company.city,
          verified: company.verified,
          logoColor: company.logoColor
        }
      : null,
    applicationsCount: applications.length,
    hasApplied: Boolean(myApplication),
    myApplicationId: myApplication?.id || null,
    myApplicationCreatedAt: myApplication?.createdAt || null
  };
}

export function enrichApplication(db, application) {
  const student = findStudent(db, application.studentId);
  const opportunity = db.opportunities.find((o) => o.id === application.opportunityId);
  const company = db.companies.find((c) => c.id === application.companyId);

  return {
    ...application,
    student: student
      ? {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          city: student.city,
          university: student.university,
          course: student.course,
          period: student.period,
          bio: student.bio,
          skills: student.skills || [],
          linkedin: student.linkedin,
          resumeName: student.resumeName,
          avatarColor: student.avatarColor
        }
      : null,
    opportunity: opportunity
      ? {
          id: opportunity.id,
          title: opportunity.title,
          area: opportunity.area,
          type: opportunity.type,
          modality: opportunity.modality,
          city: opportunity.city,
          companyId: opportunity.companyId,
          status: opportunity.status
        }
      : null,
    company: company
      ? { id: company.id, name: company.name, logoColor: company.logoColor }
      : null
  };
}

export function addNotification(db, userId, { title, body, type = 'info', link = '/app' }) {
  const notification = {
    id: `ntf_${crypto.randomUUID()}`,
    userId,
    title,
    body,
    type,
    link,
    read: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.push(notification);
  return notification;
}

export function sortNewest(list) {
  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function isExpired(opportunity) {
  if (!opportunity.deadline) return false;
  const end = new Date(`${opportunity.deadline}T23:59:59`);
  return end.getTime() < Date.now();
}
