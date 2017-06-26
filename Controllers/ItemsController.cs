using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace WebOrders.Controllers
{
    public class ItemsController : ApiController
    {
        OrdersEntities db = new OrdersEntities();
        // GET: api/Groups/5
        public IQueryable Get()
        {
            var context = HttpContext.Current;
            var agent = (agents)context.Cache["agent"];
            var dep = db.agents1.Where(s => s.id == agent.id).FirstOrDefault().dep;
            var groups = db.GoodsAgents.Where(s => s.dep == dep);
            var list = db.Groups.Where(s => groups.Any(g => s.tree.Contains(g.code)));
            var root = db.Groups.Where(s => (list.Any(g => g.tree.Contains(s.GroupId)) || list.Any(g => g.GroupId == s.GroupId)));
            return db.Items.Where(s => root.Any(r => s.tree.Contains(r.GroupId)));
        }

    }
}
