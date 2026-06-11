import type { FastifyPluginAsync } from "fastify";
import { groupNavigation } from "../../lib/serializers.js";
import { toCurrentUserPayload } from "../../plugins/auth.js";

export const siteRoutes: FastifyPluginAsync = async (app) => {
  app.get("/site", async (request) => {
    await app.authenticateOptional(request);

    const [settings, navigationItems] = await Promise.all([
      app.prisma.siteSetting.findMany({
        where: {
          isPublic: true
        }
      }),
      app.prisma.navigationItem.findMany({
        where: {
          isActive: true
        },
        orderBy: [{ location: "asc" }, { sortOrder: "asc" }, { label: "asc" }]
      })
    ]);

    const settingByKey = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));

    return {
      brand: settingByKey.brand ?? {
        name: "Blog UI",
        icon: "fa-solid fa-pen-nib",
        homeHref: "/"
      },
      footer: settingByKey.footer ?? null,
      contact: settingByKey.contact ?? null,
      navigation: groupNavigation(navigationItems),
      currentUser: request.currentUser ? toCurrentUserPayload(request.currentUser) : null
    };
  });
};
