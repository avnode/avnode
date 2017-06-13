#!groovy
node {
	def livePath = '/sites/avnode.z7'
	def node = 'node:boron'
	stage('Update source') {
		sh "cd ${livePath} && git checkout -- locales/ && git pull"
	}
	stage('Update npm dependencies') {
		sh "cd ${livePath} && docker run --rm -v ${livePath}:/data -w /data ${node} npm install"
	}
	stage('Restart all services') {
		def files = '-f docker-compose.yaml -f docker-compose.production.yaml'
		sh "cd ${livePath} && docker-compose ${files} stop && docker-compose ${files} up -d"
	}
}
