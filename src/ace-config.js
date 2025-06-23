import ace from 'ace-builds';

// Disable all workers globally
ace.config.setDefaultValue('session', 'useWorker', false);

// Set other default configurations
ace.config.set('basePath', '/');
ace.config.set('modePath', '/');
ace.config.set('themePath', '/');
ace.config.set('workerPath', null);

export default ace; 