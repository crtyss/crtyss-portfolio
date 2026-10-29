#!/bin/bash
set -euo pipefail
base=/home/crtyss/portfolio
release=$base/releases/20261029-admin
[ "$(id -u)" -eq 0 ] || { echo '请使用 sudo 运行'; exit 1; }
[ -f "$base/data/credentials.json" ]
[ -f "$release/dist/index.html" ]
backup=$(mktemp -d /home/crtyss/backups/admin-activation-XXXXXXXX)
cp -a /etc/nginx/sites-available/lin-studio "$backup/nginx.conf"
cp -a /var/www/lin-studio "$backup/site"
if [ -f /etc/systemd/system/crtyss-portfolio.service ]; then cp -a /etc/systemd/system/crtyss-portfolio.service "$backup/service"; fi
rollback() {
    echo "启用失败，恢复旧站；备份位于 $backup"
    cp "$backup/nginx.conf" /etc/nginx/sites-available/lin-studio
    rsync -a --delete "$backup/site/" /var/www/lin-studio/
    if [ -f "$backup/service" ]; then cp "$backup/service" /etc/systemd/system/crtyss-portfolio.service; else systemctl disable --now crtyss-portfolio.service || true; rm -f /etc/systemd/system/crtyss-portfolio.service; fi
    systemctl daemon-reload
    nginx -t && systemctl reload nginx
}
trap rollback ERR
install -m 644 "$base/deployment/portfolio.service" /etc/systemd/system/crtyss-portfolio.service
systemctl daemon-reload
systemctl enable crtyss-portfolio.service
systemctl restart crtyss-portfolio.service
for attempt in {1..15}; do if curl -fsS http://127.0.0.1:3001/api/admin/session >/dev/null; then break; fi; sleep 1; done
curl -fsS http://127.0.0.1:3001/api/content >/dev/null
install -m 644 "$base/deployment/nginx.conf" /etc/nginx/sites-available/lin-studio
nginx -t
rsync -a --delay-updates "$release/dist/assets/" /var/www/lin-studio/assets/
install -m 644 "$release/dist/index.html" /var/www/lin-studio/index.html
# Existing pre-rendered route copies must not shadow the new SPA entry point.
for route in works imaging; do
    if [ -d "/var/www/lin-studio/$route" ]; then
        find "/var/www/lin-studio/$route" -name index.html -type f -delete
        find "/var/www/lin-studio/$route" -depth -type d -empty -delete
    fi
done
systemctl reload nginx
curl -fsS -H 'Host: 111.8.201.55:8089' http://127.0.0.1/api/admin/session
trap - ERR
echo
echo '上线成功：http://111.8.201.55:8089/  管理入口：http://111.8.201.55:8089/admin'
echo "旧站和配置备份：$backup"
