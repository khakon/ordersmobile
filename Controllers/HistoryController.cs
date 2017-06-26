using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebOrders.Controllers
{
    public class HistoryController : ApiController
    {
        OrdersEntities db = new OrdersEntities();
        public IEnumerable Get()
        {
            agents agent;
            var context = System.Web.HttpContext.Current;
            agent = (agents)context.Cache["agent"];
            var model = new List<history>();
            if (agent == null) return model;
            foreach (var p in db.histories.Where(s => s.agent == agent.id).Select(s => s.code).Distinct().ToList())
            {
                foreach (var d in db.histories.Where(s => s.agent == agent.id && s.code == p).OrderByDescending(s => s.period).Select(t => t.iddoc).ToList().Distinct().Take(5).ToList())
                {
                    model = model.Concat(db.histories.Where(s => s.iddoc == d)).ToList();
                }
            }
            return model;
        }
    }
}
