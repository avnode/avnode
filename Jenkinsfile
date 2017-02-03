#!groovy
node {
  def livePath = '/sites/avnode.z7'
	def node = 'node:boron'
  stage('Update source') {
    sh "cd ${livePath} && git pull"
	}
  stage('Update npm dependencies') {
    sh "cd ${livePath} && docker run --rm -v ${livePath}:/data -w /data ${node} npm install"
	}
	stage('Restart all services') {
    sh "cd ${livePath} && docker-compose restart"
	}
}
