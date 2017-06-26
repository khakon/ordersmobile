using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace WebOrders.Controllers
{
    public class GroupsController : ApiController
    {
        OrdersEntities db = new OrdersEntities();
        public IQueryable Get()
        {
            var context = HttpContext.Current;
            var agent = (agents)context.Cache["agent"];
            var dep = db.agents1.Where(s => s.id == agent.id).FirstOrDefault().dep;
            var groups = db.GoodsAgents.Where(s => s.dep == dep);
            var list = db.Groups.Where(s => groups.Any(g => s.tree.Contains(g.code)));
            var root = db.Groups.Where(s => (list.Any(g => g.tree.Contains(s.GroupId)) || list.Any(g => g.GroupId == s.GroupId)));
            return root;
        }

        // GET: api/Groups/5
        public IQueryable Get(string id)
        {
            var context = HttpContext.Current;
            var agent = (agents)context.Cache["agent"];
            var dep = db.agents1.Where(s => s.id == agent.id).FirstOrDefault().dep;
            var groups = db.GoodsAgents.Where(s => s.dep == dep);
            var list = db.Groups.Where(s => groups.Any(g => s.tree.Contains(g.code)));
            var root = db.Groups.Where(s => s.ParentId == id && (list.Any(g => g.tree.Contains(s.GroupId)) || list.Any(g => g.GroupId == s.GroupId)));
            return root;
        }

        // POST: api/Groups
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Groups/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Groups/5
        public void Delete(int id)
        {
        }
    }
}
