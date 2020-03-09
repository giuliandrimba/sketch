function ProjectorHelper()
{
    this.m_vPos = new THREE.Vector3();
    this.m_vDir = new THREE.Vector3();

    this.compute = function( nMouseX, nMouseY, Camera, vOutPos )
    {
        var vPos = this.m_vPos;
        var vDir = this.m_vDir;

        vPos.set(
            -1.0 + 2.0 * nMouseX / window.innerWidth,
            -1.0 + 2.0 * nMouseY / window.innerHeight,
            0.5
        ).unproject( Camera );


        // Calculate a unit vector from the camera to the projected position
        vDir.copy( vPos ).sub( Camera.position ).normalize();

        // Project onto z=0
        var flDistance = -Camera.position.z / vDir.z;
        vOutPos.copy( Camera.position ).add( vDir.multiplyScalar( flDistance ) );
    }
}

module.exports = ProjectorHelper;
